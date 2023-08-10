import React, { useState, useEffect } from "react";
import { GoPencil, GoTrash, GoPlus } from "react-icons/go";
import { MdIosShare } from "react-icons/md";
import { searchCocktails } from "../utils/API";
import "../styles/components/CocktailCard.css";

const CocktailCard = ({
  loading,
  cocktails,
  page,
  handleAddCocktail,
  handleDeleteCocktail,
  handleEditCocktail,
  handleShareRecipe,
  customClass,
  cocktailAdded,
  defaultExpanded,
}) => {
  const [expandedCocktail, setExpandedCocktail] = useState(
    defaultExpanded ? (cocktails.length > 0 ? cocktails[0] : null) : null
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768 || customClass === "about-cocktail-card"
      ); // 'isMobile' is true with viewport with width < 768px
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
    return (
      <h3 className="cocktail-card-default-message">
        Search by "Name", "Ingredient", or get a "Random" cocktail recipe using
        buttons above
      </h3>
    );
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
      {cocktails.map((cocktail) => {
        return (
          <div
            className={`card card-cocktail ${
              expandedCocktail && expandedCocktail._id === cocktail._id
                ? `expanded ${customClass}-expanded`
                : ""
            } ${customClass}`}
            key={cocktail._id}
          >
            <div
              className={`card-content ${customClass}-content`}
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
                className={`expanded-content ${customClass}-expanded-content ${
                  isMobile ? "expanded-mobile" : "expanded-desktop"
                }`}
              >
                {expandedCocktail ? (
                  <>
                    <h3 className="card-h3">Ingredients:</h3>
                    <ul className="card-list">
                      {expandedCocktail.ingredients.map((ingredient, index) => (
                        <li key={index}>
                          {ingredient.quantity} {ingredient.name}
                        </li>
                      ))}
                    </ul>
                    <h3 className="card-h3" id="card-h3-instructions">
                      Instructions:
                    </h3>
                    <p className="card-instructions">
                      {expandedCocktail.instructions}
                    </p>
                    <div className="card-expanded-footer">
                      {page === "Favorites" && (
                        <>
                          <button
                            className="btn cocktail-card-btn"
                            id={cocktail._id}
                            onClick={() => handleDeleteCocktail(cocktail._id)}
                          >
                            <GoTrash />
                          </button>
                          <button
                            className="btn cocktail-card-btn"
                            id={cocktail._id}
                            onClick={() => handleEditCocktail(cocktail)}
                          >
                            <GoPencil />
                          </button>
                          <button
                            className="btn cocktail-card-btn"
                            id={cocktail._id}
                            onClick={() => handleShareRecipe(cocktail)}
                          >
                            <MdIosShare />
                          </button>
                        </>
                      )}
                      {cocktailAdded[cocktail._id] ? (
                        <p id="cocktail-card-added-message">
                          Cocktail Added to Favorites!
                        </p>
                      ) : (
                        page === "SearchCocktails" && (
                          <button
                            className="btn cocktail-card-add-btn"
                            id={cocktail._id}
                            onClick={() => handleAddCocktail(cocktail)}
                          >
                            <GoPlus /> Add to Favorites
                          </button>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <p>Loading Recipe...</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default CocktailCard;
