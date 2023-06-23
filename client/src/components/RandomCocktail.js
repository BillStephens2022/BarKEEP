import React, { useState, useEffect } from "react";
import { getRandomCocktail } from "../utils/API";
import CocktailCard from "./CocktailCard";

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
      <CocktailCard cocktails={randomCocktail} />
    </div>
  );
};

export default RandomCocktail;
