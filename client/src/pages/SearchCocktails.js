import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { ADD_COCKTAIL } from "../utils/mutations";
import { searchCocktails } from "../utils/API";

const SearchCocktails = () => {
  // create state for holding returned google api data
  const [searchedCocktails, setSearchedCocktails] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  const [addCocktail] = useMutation(ADD_COCKTAIL);

  // create state to hold saved bookId values in local storage - need to add function in utils folder
  // const [savedCocktailIds, setSavedCocktailIds] = useState(getSavedCocktailIds());

  const handleSearchSubmit = async (event) => {
    // add asynchronous function to handle cocktail searches from the API
    event.preventDefault();
    if (!searchInput) {
      return false;
    }
    try {
      const response = await searchCocktails(searchInput);

      if (response.status !== 200) {
        console.log("response: ", response);
        throw new Error("something went wrong!");
      }
      console.log("RESPONSE: ", response);
      const items = await response.json();
      console.log(items.drinks);
      const cocktailData = items.drinks.map((cocktail) => ({
        name: cocktail.strDrink,
        imageURL: cocktail.strDrinkThumb,
        instructions: cocktail.strInstructions,
        glassware: cocktail.strGlass,
        ingredients: [],
        tags: [],
      }));
      console.log("SEARCH RESULTS: ", cocktailData);
      setSearchedCocktails(cocktailData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">Search for a Cocktail</h2>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="input_search_cocktails"
          placeholder="Search for a cocktail..."
          value={searchInput}
          name="searchInput"
          onChange={(e) => setSearchInput(e.target.value)}
        ></input>
        <button className="btn button_search_cocktails" type="submit">
          Go!
        </button>
      </form>
    </div>
  );
};

export default SearchCocktails;
