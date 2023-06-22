import React, { useState } from "react";
import SearchCocktailName from "../components/SearchCocktailName";
import SearchCocktailIngredient from "../components/SearchCocktailIngredient";
import "../styles/Home.css";

const SearchCocktailsTest = () => {
  const [searchBy, setSearchBy] = useState("");

  const renderSearchComponent = () => {
    switch (searchBy) {
      case "name":
        return <SearchCocktailName />;
      case "ingredient":
        return <SearchCocktailIngredient />;
      default:
        return null;
    }
  };

  var buttons = document.getElementsByClassName("btn-search");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      // Remove the active class from the previously active button
      if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
      }
      // Add the active class to the clicked button
      this.className += " active";
    });
  }

  return (
    <div className="searchCocktails">
      <h1 className="title">BarKEEP</h1>
      <h2 className="search-header">Search by:</h2>
      <div className="div-search-btn">
        <button className="btn btn-search btn-searchByName" onClick={() => setSearchBy("name")}>Name</button>
        <button className="btn btn-search btn-searchByIngredient" onClick={() => setSearchBy("ingredient")}>Ingredient</button>
      </div>
      <div className="div-search-component">
      {renderSearchComponent()}
      </div>
      
    </div>
  );
};

export default SearchCocktailsTest;
