import React, { useState, useEffect } from "react";
import { getRandomCocktail } from "../utils/API";
import CocktailCard from "./CocktailCard";

const RandomCocktail = ({ handleAddCocktail, addedCocktailId, cocktailAdded }) => {
  // State to store the random cocktail data
  const [randomCocktail, setRandomCocktails] = useState([]);

  // Fetch a random cocktail data from API when component mounts
  useEffect(() => {
    const fetchRandomCocktail = async () => {
      const cocktailData = await getRandomCocktail();
      setRandomCocktails(cocktailData);
    };
    fetchRandomCocktail();
  }, []);

  return (
    <div className="card-container">
      {/* Render the CocktailCard component with the fetched random cocktail data */}
      <CocktailCard
        cocktails={randomCocktail}
        page="SearchCocktails"
        handleAddCocktail={handleAddCocktail}
        addedCocktailId={addedCocktailId}
        cocktailAdded={cocktailAdded}
      />
    </div>
  );
};

export default RandomCocktail;
