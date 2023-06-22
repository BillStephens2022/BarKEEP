import React from "react";
import "../styles/CocktailCardLite.css";

const CocktailCardLite = ({ loading, cocktails }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cocktails.length) {
    return <h3 className="cocktail_card_error">No cocktails to display yet</h3>;
  }

  return (
    <>
      {cocktails.map((cocktail) => (
        <div
          className="card card-cocktail-lite"
          key={cocktail._id}
          style={{ backgroundImage: `url(${cocktail.imageURL})` }}
        >
          <div className="card_title">{cocktail.name}</div>

          <div className="card-cocktail-lite-footer">
            <button className="btn btn-seeRecipe" id={cocktail._id}>
              See Recipe
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default CocktailCardLite;
