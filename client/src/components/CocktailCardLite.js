import React, { useState } from "react";
import { GoPencil, GoTrash, GoPlus } from "react-icons/go";
import { QUERY_ME } from "../utils/queries";
import { searchCocktails } from "../utils/API";
import { Auth } from "../utils/auth";
import "../styles/CocktailCardLite.css";

const CocktailCardLite = ({
  loading,
  cocktails,
  setCocktails,
  page,
  handleAddCocktail,
  deleteCocktail,
  handleEditCocktail
}) => {
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
      if (expandedCocktail && expandedCocktail._id === cocktail._id) {
        setExpandedCocktail(null); // If already expanded, hide the recipe
      } else {
        setExpandedCocktail(cocktail);
      }
    }
  };

  const handleDeleteCocktail = async (e) => {
    e.preventDefault();
    const cocktailId = e.currentTarget.id;
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;
    console.log("deleting cocktail!");
    try {
      const { data } = await deleteCocktail({
        variables: { cocktailId },
        refetchQueries: [{ query: QUERY_ME }]
      });
      if (!data) {
        throw new Error("something went wrong!");
      }
      console.log("done!");
    } catch (err) {
      console.error(err);
    }
    setCocktails(cocktails.filter((cocktails) => cocktails._id !== cocktailId));
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
          <div
            className="card-content"
            style={{ backgroundImage: `url(${cocktail.imageURL})` }}
          >
            <div className="card-title-lite">{cocktail.name}</div>
            <div className="card-cocktail-lite-footer">
              <button
                className="btn btn-seeRecipe"
                id={cocktail._id}
                onClick={() => handleSeeRecipe(cocktail)}
              >
                {expandedCocktail && expandedCocktail._id === cocktail._id
                  ? "Hide Recipe"
                  : "See Recipe"}
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
              <p className="card-lite-instructions">
                {expandedCocktail.instructions}
              </p>
              <div className="card-lite-expanded-footer">
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
                      onClick={() => handleEditCocktail(cocktail)}
                    >
                      <GoPencil />
                    </button>
                  </>
                )}
                {page === "SearchCocktails" && (
                  <button
                    className="btn btn-add"
                    id={cocktail._id}
                    onClick={() => handleAddCocktail(cocktail)}
                  >
                    <GoPlus /> Add to Favorites
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CocktailCardLite;
