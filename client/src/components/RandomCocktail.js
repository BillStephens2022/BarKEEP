import React, { useState, useEffect } from "react";
import { getRandomCocktail } from "../utils/API";
import CocktailCardLite from "./CocktailCardLite";

const RandomCocktail = () => {
  const [randomCocktail, setRandomCocktails] = useState([]);

  useEffect(() => {
    const fetchRandomCocktail = async () => {
      const cocktailData = await getRandomCocktail();
      setRandomCocktails(cocktailData);
    };
    fetchRandomCocktail();
  }, []);

  return (
    <div className="card-container">
      <CocktailCardLite cocktails={randomCocktail} page="SearchCocktails" />
    </div>
  );
};

export default RandomCocktail;
