import React, { useState } from "react";
import { searchCocktails } from "../utils/API";
import CocktailCard from "./CocktailCard";
import "../styles/pages/SearchCocktails.css";

const SearchCocktailName = ({handleAddCocktail, addedCocktailId, cocktailAdded}) => {
  // create state for holding returned google api data
  const [searchedCocktails, setSearchedCocktails] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");
  // Track if a search has been executed
  const [searchExecuted, setSearchExecuted] = useState(false); 

 

  // create state to hold saved bookId values in local storage - need to add function in utils folder
  // const [savedCocktailIds, setSavedCocktailIds] = useState(getSavedCocktailIds());

  const handleSearchSubmit = async (event) => {
    // add asynchronous function to handle cocktail searches from the API
    if (event) {
      event.preventDefault();
    }
    if (!searchInput) {
      return false;
    }

    // searchCocktails is a helper function in utilities folder for API call to TheCocktailDB to search recipes by cocktail name
    const cocktailData = await searchCocktails(searchInput);

   
    setSearchedCocktails(cocktailData);
    setSearchExecuted(true);
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
        <button className="btn button-search-cocktails" type="submit">
          Go!
        </button>
      </form>
      <div className="card-container">
      {/* Conditional rendering for default message */}
      {!searchExecuted && (
        <h3 className="cocktail-card-default-message">
          Search by "Name", "Ingredient", or get a "Random" cocktail recipe using
          buttons above
        </h3>
      )}
       {/* Conditional rendering for message when no cocktails are found */}
       {searchExecuted && searchedCocktails.length === 0 && (
          <p id="search-no-results-message">No cocktails found. Try a different search.</p>
        )}
        {searchedCocktails.length > 0 && (
          <CocktailCard
            cocktails={searchedCocktails}
            page="SearchCocktails"
            handleAddCocktail={handleAddCocktail}
            addedCocktailId={addedCocktailId}
            cocktailAdded={cocktailAdded}
          />
        )}
      </div>
    </div>
  );
};

export default SearchCocktailName;
