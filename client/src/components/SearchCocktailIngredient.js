import React, { useState } from "react";
import "../styles/Home.css";

const SearchCocktailIngredient = () => {
  const [selectedIngredient, setSelectedIngredient] = useState();
  const handleIngredientChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedIngredient(selectedValue);
  };

  return (
    <div className="searchIngredient">
      
      <select
        className="ingredient_dropdown"
        value={selectedIngredient}
        onChange={handleIngredientChange}
      >
        <option value="">Select an Ingredient</option>
        <option value="gin">Gin</option>
        <option value="rum">Rum</option>
        <option value="tequila">Tequila</option>
        <option value="vodka">Vodka</option>
        <option value="whiskey">Whiskey</option>
      </select>
    </div>
  );
};

export default SearchCocktailIngredient;
