const mongoose = require('mongoose');

// Connect to the MongoDB database using the provided URI (provided as environment variable in Heroku/production) 
// or a default URI for local development
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/barkeep', {
  useNewUrlParser: true,  // Use the new URL parser
  useUnifiedTopology: true,  // Use the new Server Discovery and Monitoring engine
  useCreateIndex: true,  // Create indexes for unique fields
  useFindAndModify: false,  // Use native findOneAndUpdate() instead of findAndModify()
});

// Export the MongoDB connection instance
module.exports = mongoose.connection;