import React, { useState, useEffect } from "react";
import { getCocktailsbyIngredient } from "../utils/API";
import CocktailCardLite from "./CocktailCardLite";
import "../styles/Home.css";


// component for when user chooses to search cocktails by ingredient

const SearchCocktailIngredient = () => {
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
    "baileys",
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
        try {
          console.log("API call triggered");
          const response = await getCocktailsbyIngredient(selectedIngredient);
          if (response.status !== 200) {
            console.log("API call failed");
            console.log("response: ", response);
            console.log(response.status);
            throw new Error("Something went wrong!");
          }
          setSearchedCocktails(response.cocktailData);
        } catch (error) {
          console.error(error);
          setSearchedCocktails([]);
        }
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
      <div className="card_container">
        <CocktailCardLite cocktails={searchedCocktails} page="SearchCocktails" />
      </div>
    </div>
  );
};

export default SearchCocktailIngredient;
