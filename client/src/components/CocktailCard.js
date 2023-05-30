import React from "react";
import "../styles/Home.css";
import { GoPencil, GoTrashcan } from "react-icons/go";
import Auth from "../utils/auth";

const CocktailCard = ({ data, loading, cocktails, setCocktails, deleteCocktail }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cocktails.length) {
    return <h3>No Cocktails Saved Yet</h3>;
  }

  const handleDeleteCocktail = async (e) => {
    e.preventDefault();
    const cocktailId = e.currentTarget.id;
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;
    console.log("deleting cocktail!")
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
    setCocktails(
      cocktails.filter((cocktails) => cocktails._id !== cocktailId)
    );
    console.log(data);
  }

  const handleEditCocktail = () => {
    console.log("editing cocktail!")
    return;
  }

  return (
    <>
      {cocktails.map((cocktail) => (
        <div className="card" key={cocktail._id}>
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
                <li className="ingredient" key={index}>{ingredient.quantity} {ingredient.name}</li>
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
            <button
              className="btn"
              id={cocktail._id}
              onClick={handleEditCocktail}
              >
              <GoPencil />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default CocktailCard;
