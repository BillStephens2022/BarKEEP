import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Favorites from "./pages/Favorites";
import SearchCocktails from "./pages/SearchCocktails";
import Login from "./pages/Login";
import Footer from "./components/Footer";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Cocktail: {
        fields: {
          ingredients: {
            merge(existing, incoming) {
              // Remove __typename field from each ingredient
              const updatedIngredients = incoming.map((ingredient) => {
                const { __typename, ...rest } = ingredient;
                return rest;
              });

              return updatedIngredients;
            },
          },
        },
      },
    },
  }),
});

function App() {
  const [cocktails, setCocktails] = useState([]);
  const [posts, setPosts] = useState([]);
  console.log("from App.js: ", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
  return (
    <ApolloProvider client={client}>
      <Router basename={process.env.PUBLIC_URL}>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/Feed"
              element={
                <Feed posts={posts} setPosts={setPosts} />
              }
            />
            <Route
              path="/Favorites"
              element={
                <Favorites cocktails={cocktails} setCocktails={setCocktails} />
              }
            />
            <Route path="/searchCocktails" element={<SearchCocktails />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
          <Footer />
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
