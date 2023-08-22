import React, { useState, useEffect } from "react";
import { getCocktailsbyIngredient } from "../utils/API";
import CocktailCard from "./CocktailCard";
import "../styles/pages/Home.css";

// Component for searching cocktails by ingredient

const SearchCocktailIngredient = ({ handleAddCocktail, addedCocktailId, cocktailAdded }) => {
  // State to store the selected ingredient
  const [selectedIngredient, setSelectedIngredient] = useState("");

  // State to store the cocktails searched by ingredient
  const [searchedCocktails, setSearchedCocktails] = useState([]);

  // Handler for changing the selected ingredient
  const handleIngredientChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedIngredient(selectedValue);
  };

  // List of ingredient options for the dropdown menu
  const ingredientOptions = [
    "",
    "absinthe",
    "amaretto",
    "aperol",
    "baileys Irish Cream",
    "bourbon",
    "brandy",
    "campari",
    "champagne",
    "cognac",
    "gin",
    "kahlua",
    "mezcal",
    "rum",
    "scotch",
    "tequila",
    "vermouth",
    "vodka",
    "whiskey",
  ];
  
  // Effect to handle searching cocktails by selected ingredient
  useEffect(() => {
    const handleSearchbyIngredient = async () => {
      if (selectedIngredient) {
        const cocktailData = await getCocktailsbyIngredient(selectedIngredient);
        setSearchedCocktails(cocktailData);
      } else {
        setSearchedCocktails([]);
      }
    };
    handleSearchbyIngredient();
  }, [selectedIngredient]);

  return (
    <div className="searchIngredient">
      {/* Dropdown menu for selecting an ingredient */}
      <select
        className="ingredient-dropdown"
        value={selectedIngredient}
        onChange={handleIngredientChange}
      >
        <option value="">Select an Ingredient</option>
        {ingredientOptions.map((ingredient) => (
          <option key={ingredient} value={ingredient}>
            {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
          </option>
        ))}
      </select>
      {/* Display the searched cocktails */}
      <div className="card-container">
        <CocktailCard
          cocktails={searchedCocktails}
          page="SearchCocktails"
          handleAddCocktail={handleAddCocktail}
          addedCocktailId={addedCocktailId}
          cocktailAdded={cocktailAdded}
        />
      </div>
    </div>
  );
};

export default SearchCocktailIngredient;
