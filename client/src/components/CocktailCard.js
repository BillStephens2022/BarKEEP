import React from "react";
import "../styles/Home.css";
import { GoTrashcan } from "react-icons/go";
import Auth from "../utils/auth";

const CocktailCard = ({ data, loading, cocktails, setCocktails }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cocktails.length) {
    return <h3>No Cocktails Saved Yet</h3>;
  }

  const handleDeleteCocktail = () => {
    return
  }

  return (
    <>
      {cocktails.map((cocktail) => (
        <div className="card">
          <div className="card_title">{cocktail.name}</div>
          <div className="card_body">
            <div className="card_photo">
              <img
                className="cocktail_photo"
                src={cocktail.imageURL}
              ></img>
            </div>
            <div className="card_recipe">
              <ul className="ingredients_list">
                {cocktail.ingredients.map((ingredient) => (
                <li className="ingredient">{ingredient.quantity} {ingredient.name}</li>
                ))}
              </ul>
              <h5>Instructions</h5>
              <p className="p_instructions">{cocktail.instructions}</p>
            </div>
          </div>
          <div className="card_footer">
            <button
              className="btn"
              id={cocktail._id}
              onClick={handleDeleteCocktail}
              >
              <GoTrashcan />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default CocktailCard;
