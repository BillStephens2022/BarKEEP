import React, { useState } from "react";
import "../styles/CocktailCard.css";
import { GoPencil, GoTrash, GoPlus } from "react-icons/go";
import Auth from "../utils/auth";


const CocktailCard = ({
  data,
  loading,
  cocktails,
  setCocktails,
  deleteCocktail,
  page,
  handleAddCocktail,
  addedCocktailId,
}) => {
  const [flippedCard, setFlippedCard] = useState(null);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cocktails.length) {
    return <h3 className="cocktail_card_error">No cocktails to display yet</h3>;
  }

  const handleDeleteCocktail = async (e) => {
    e.preventDefault();
    const cocktailId = e.currentTarget.id;
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;
    console.log("deleting cocktail!");
    try {
      const { data } = await deleteCocktail({
        variables: { cocktailId },
      });
      if (!data) {
        throw new Error("something went wrong!");
      }
      console.log("done!");
    } catch (err) {
      console.error(err);
    }
    setCocktails(cocktails.filter((cocktails) => cocktails._id !== cocktailId));
    console.log(data);
  };

  const handleEditCocktail = () => {
    console.log("editing cocktail!");
    return;
  };

  const handleCardFlip = (cocktailId) => {
    setFlippedCard(cocktailId);
  };

  return (
    <>
      {cocktails.map((cocktail) => (
        <div
          className={`card ${flippedCard === cocktail._id ? "flipped" : ""}`}
          key={cocktail._id}
          onClick={() => handleCardFlip(cocktail._id)}
        >
          <div className="card-side card-front">
            <div className="card_title">{cocktail.name}</div>
            <div className="card_body">
              <div className="card_photo">
                <img
                  className="cocktail_photo"
                  src={cocktail.imageURL}
                  alt="cocktail"
                ></img>
              </div>
              <div className="card_recipe">
                <ul className="ingredients_list">
                  {cocktail.ingredients.map((ingredient, index) => (
                    <li className="ingredient" key={index}>
                      {ingredient.quantity} {ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="card-side card-back">
            <h5 className="h_instructions">Instructions</h5>
            <p className="p_instructions">{cocktail.instructions}</p>
          </div>
          <div className="card_footer">
          {page === "Favorites" && (
            <>
            <button
              className="btn cocktail_card_btn"
              id={cocktail._id}
              onClick={handleDeleteCocktail}
            >
              <GoTrash />
            </button>
            <button
              className="btn cocktail_card_btn"
              id={cocktail._id}
              onClick={handleEditCocktail}
            >
              <GoPencil />
            </button>
            </>
          )}
          {page === "SearchCocktails" && (
            <button 
              className="btn btn-add"
              id={cocktail._id}
              onClick={() => handleAddCocktail(cocktail)}>
                <GoPlus /> Add to Favorites
            </button>
          )}
          {cocktail._id === addedCocktailId && <p className="success_message">Added to Favorites!</p>}
          </div>
        </div>
      ))}
    </>
  );
};

export default CocktailCard;
