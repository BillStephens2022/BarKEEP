const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const {  authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// Initialize Express app and set port
const app = express();
const PORT = process.env.PORT || 3001;

// Create an instance of ApolloServer with typeDefs, resolvers, and context for authentication
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// Configure middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve client build folder as static assets if in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Start ApolloServer and initialize the Express app
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};
  
// Call the function to start ApolloServer and Express app
startApolloServer(typeDefs, resolvers);
