import React, { useState } from "react";
import "../styles/CocktailCardLite.css";
import { searchCocktails } from "../utils/API";

const CocktailCardLite = ({ loading, cocktails }) => {
  const [expandedCocktail, setExpandedCocktail] = useState(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cocktails.length) {
    return <h3 className="cocktail_card_error">No cocktails to display yet</h3>;
  }

  const handleSeeRecipe = async (cocktail) => {
    if (!cocktail.ingredients.length) {
      const cocktailRecipe = await searchCocktails(cocktail.name);
      if (expandedCocktail && expandedCocktail._id === cocktail._id) {
        setExpandedCocktail(null); // If already expanded, hide the recipe
      } else {
        setExpandedCocktail(cocktailRecipe[0]);
      }
    } else {
      setExpandedCocktail(cocktail);
    }
  };

  return (
    <>
      {cocktails.map((cocktail) => (
        <div
          className={`card card-cocktail-lite ${
            expandedCocktail && expandedCocktail._id === cocktail._id
              ? "expanded"
              : ""
          }`}
          key={cocktail._id}
          
        >
          <div className="card-content" style={{ backgroundImage: `url(${cocktail.imageURL})` }}>
            <div className="card-title-lite">{cocktail.name}</div>
            <div className="card-cocktail-lite-footer">
              <button
                className="btn btn-seeRecipe"
                id={cocktail._id}
                onClick={() => handleSeeRecipe(cocktail)}
              >
                {expandedCocktail && expandedCocktail._id === cocktail._id ? "Hide Recipe" : "See Recipe"}
              </button>
            </div>
          </div>
          {expandedCocktail && expandedCocktail._id === cocktail._id && (
            <div className="expanded-content">
              <h3 className="card-lite-h3">Ingredients:</h3>
              <ul className="card-lite-list">
                {expandedCocktail.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.quantity} {ingredient.name}
                  </li>
                ))}
              </ul>
              <h3 className="card-lite-h3">Instructions:</h3>
              <p className="card-lite-instructions">{expandedCocktail.instructions}</p>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CocktailCardLite;
