import React, { useState, useEffect } from "react";
import { getCocktailsbyIngredient } from "../utils/API";
import CocktailCard from "./CocktailCard";
import "../styles/Home.css";

const SearchCocktailIngredient = () => {
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [searchedCocktails, setSearchedCocktails] = useState([]);

  const handleIngredientChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedIngredient(selectedValue);
  };

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
          const searchResults = await response.json();
          let cocktailData = [];
          cocktailData = searchResults.drinks.map((cocktail) => {
            const ingredients = [];
            const tags = [];
            for (let i = 1; i <= 15; i++) {
              const ingredient = cocktail[`strIngredient${i}`];
              const quantity = cocktail[`strMeasure${i}`];
              if (ingredient) {
                ingredients.push({ name: ingredient, quantity: quantity });
                tags.push(ingredient);
              } else {
                break; // stop iterating if no more ingredients are found
              }
            }
            return {
              _id: cocktail.idDrink,
              name: cocktail.strDrink,
              imageURL: cocktail.strDrinkThumb,
              instructions: cocktail.strInstructions,
              glassware: cocktail.strGlass,
              ingredients: ingredients,
              tags: tags,
            };
          });
          setSearchedCocktails(cocktailData);
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
        <CocktailCard cocktails={searchedCocktails} page="SearchCocktails" />
      </div>
    </div>
  );
};

export default SearchCocktailIngredient;
