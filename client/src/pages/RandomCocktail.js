import React, { useState, useEffect } from "react";
import { getRandomCocktail } from "../utils/API";
import CocktailCard from "../components/CocktailCard";

const RandomCocktail = () => {
  const [randomCocktail, setRandomCocktails] = useState([]);

  useEffect(() => {
  const fetchRandomCocktail = async () => {
    try {
      const response = await getRandomCocktail();
      const randomCocktail = await response.json();
      console.log(randomCocktail.drinks[0].strDrink);
      const cocktailData = randomCocktail.drinks.map((cocktail) => {
        const ingredients = [];
        const tags = [];
        for (let i = 1; i <= 15; i++) {
          const ingredient = cocktail[`strIngredient${i}`];
          const quantity = cocktail[`strMeasure${i}`];
          if (ingredient) {
            ingredients.push({name: ingredient, quantity: quantity});
            tags.push(ingredient)
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
      // will need to map ingredients and quantities from API call into ingredients array.
      console.log("SEARCH RESULTS: ", cocktailData);
      setRandomCocktails(cocktailData);
    } catch (error) {
      console.error("Error fetching cocktail data:", error);
    }
  };
  fetchRandomCocktail();
}, []);
  
  return (
    <div>
      <h1>Random Cocktail</h1>
      <CocktailCard cocktails={randomCocktail} />
    </div>
  );
};

export default RandomCocktail;
