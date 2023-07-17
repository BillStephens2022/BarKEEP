import React, { useState } from "react";
import { searchCocktails } from "../utils/API";
import CocktailCardLite from "./CocktailCardLite";
import "../styles/SearchCocktails.css";

const SearchCocktailName = ({handleAddCocktail, addedCocktailId}) => {
  // create state for holding returned google api data
  const [searchedCocktails, setSearchedCocktails] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

 

  // create state to hold saved bookId values in local storage - need to add function in utils folder
  // const [savedCocktailIds, setSavedCocktailIds] = useState(getSavedCocktailIds());

  const handleSearchSubmit = async (event) => {
    // add asynchronous function to handle cocktail searches from the API
    console.log(event);
    if (event) {
      event.preventDefault();
    }
    if (!searchInput) {
      return false;
    }

    // searchCocktails is a helper function in utilities folder for API call to TheCocktailDB to search recipes by cocktail name
    const cocktailData = await searchCocktails(searchInput);

   
    setSearchedCocktails(cocktailData);
  };

  return (
    <div className="searchName">
      <form className="searchNameForm" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="input-search-cocktails"
          placeholder="Search for a cocktail..."
          value={searchInput}
          name="searchInput"
          onChange={(e) => setSearchInput(e.target.value)}
        ></input>
        <button className="btn button_search_cocktails" type="submit">
          Go!
        </button>
      </form>
      <div className="card-container">
        <CocktailCardLite
          cocktails={searchedCocktails}
          page="SearchCocktails"
          handleAddCocktail={handleAddCocktail}
          addedCocktailId={addedCocktailId}
        />
      </div>
    </div>
  );
};

export default SearchCocktailName;
