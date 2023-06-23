import React, { useState, useEffect } from "react";
import { getRandomCocktail } from "../utils/API";
import CocktailCard from "../components/CocktailCard";

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
    <div>
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">Random Cocktail</h2>
      <CocktailCard cocktails={randomCocktail} />
    </div>
  );
};

export default RandomCocktail;
