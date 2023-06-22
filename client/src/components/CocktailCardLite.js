import React from "react";
import "../styles/CocktailCardLite.css";

const CocktailCardLite = ({
  loading,
  cocktails,
  handleAddCocktail,
  
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cocktails.length) {
    return <h3 className="cocktail_card_error">No Cocktails to display yet</h3>;
  }


  return (
    <>
      {cocktails.map((cocktail) => (
        <div className="card card-cocktail-lite" key={cocktail._id}>
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
            </div>
          </div>
          <div className="card_footer">
            <button
              className="btn btn-seeRecipe"
              id={cocktail._id}
              onClick={() => handleAddCocktail(cocktail)}
            >
              See Recipe
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default CocktailCardLite;
