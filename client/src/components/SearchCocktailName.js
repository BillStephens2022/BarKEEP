import React, { useState } from "react";
import { searchCocktails } from "../utils/API";
import CocktailCard from "./CocktailCard";
import "../styles/pages/SearchCocktails.css";

const SearchCocktailName = ({handleAddCocktail, addedCocktailId, cocktailAdded}) => {
  // State to hold returned cocktail data from the API
  const [searchedCocktails, setSearchedCocktails] = useState([]);

  // State to hold the search input value
  const [searchInput, setSearchInput] = useState("");

  // State to track whether a search has been executed
  const [searchExecuted, setSearchExecuted] = useState(false); 

  // Function to handle the search form submission
  const handleSearchSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    if (!searchInput) {
      return false;
    }

    // Call the API to search cocktails by name
    const cocktailData = await searchCocktails(searchInput);

    // Update the state with the retrieved cocktail data and mark search as executed
    setSearchedCocktails(cocktailData);
    setSearchExecuted(true);
  };

  return (
    <div className="searchName">
      {/* Search form */}
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
        {/* Display searched cocktails */}
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
