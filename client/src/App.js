import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cocktails from './pages/Cocktails';
import Login from './pages/Login';



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
  cache: new InMemoryCache(),
});

function App() {

  const [cocktails, setCocktails] = useState([]);

  return (
    <ApolloProvider client={client}>
      <Router basename={process.env.PUBLIC_URL}>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/cocktails"
              element={<Cocktails cocktails={cocktails} setCocktails={setCocktails} />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            {/* <Route
              path="/cocktails/add"
              element={
                <CocktailForm />
              }
            /> */}
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;