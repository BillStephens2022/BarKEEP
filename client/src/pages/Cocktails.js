import React from "react";
import "../styles/Home.css";
import CocktailCard from "../components/CocktailCard";

const Cocktails = () => {
  return (
    <div className="cocktails-main">
      <h1 className="title">BarKEEP</h1>
      <h2 className="subtitle">My Cocktail Recipes</h2>
      <div className="card_container">
        <CocktailCard />
      </div>
    </div>
  );
};

export default Cocktails;
