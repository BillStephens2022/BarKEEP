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

  return (
    <div>
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">Search by:</h2>
      <button onClick={() => setSearchBy("name")}>Name</button>
      <button onClick={() => setSearchBy("ingredient")}>Ingredient</button>
      {renderSearchComponent()}
    </div>
  );
};

export default SearchCocktailsTest;
