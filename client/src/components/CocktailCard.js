import React, { useState, useEffect } from "react";
import { GoPencil, GoTrash, GoPlus } from "react-icons/go";
import { searchCocktails } from "../utils/API";
import "../styles/components/CocktailCard.css";

const CocktailCard = ({
  loading,
  cocktails,
  page,
  handleAddCocktail,
  handleDeleteCocktail,
  handleEditCocktail,
}) => {
  const [expandedCocktail, setExpandedCocktail] = useState(null);
  //
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 'isMobile' is true with viewport with width < 768px
    };

    // Add event listener to handle resizing
    window.addEventListener("resize", handleResize);

    // Call handleResize to set initial value
    handleResize();

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  return (
    <>
      {cocktails.map((cocktail) => (
        <div
          className={`card card-cocktail ${
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
            <div className="card-title">{cocktail.name}</div>
            <div className="card-cocktail-footer">
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
            <div
              className={`expanded-content ${
                isMobile ? "expanded-mobile" : "expanded-desktop"
              }`}
            >
              <h3 className="card-h3">Ingredients:</h3>
              <ul className="card-list">
                {expandedCocktail.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.quantity} {ingredient.name}
                  </li>
                ))}
              </ul>
              <h3 className="card-h3">Instructions:</h3>
              <p className="card-instructions">
                {expandedCocktail.instructions}
              </p>
              <div className="card-expanded-footer">
                {page === "Favorites" && (
                  <>
                    <button
                      className="btn cocktail_card_btn"
                      id={cocktail._id}
                      onClick={() => handleDeleteCocktail(cocktail._id)}
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

export default CocktailCard;
