import React, { useState, useEffect } from "react";
import { getCocktailsbyIngredient } from "../utils/API";
import CocktailCardLite from "./CocktailCardLite";
import "../styles/Home.css";

// component for when user chooses to search cocktails by ingredient

const SearchCocktailIngredient = ({ handleAddCocktail, addedCocktailId }) => {
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [searchedCocktails, setSearchedCocktails] = useState([]);

  // picks up selected value from dropdown menu so search can be done by the specific ingredient chosen
  const handleIngredientChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedIngredient(selectedValue);
  };
  // array of specific ingredients - used to populate dropdown menu(Select element options)
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
      <select
        className="ingredient_dropdown"
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

export default SearchCocktailIngredient;
