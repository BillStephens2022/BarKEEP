import React from "react";

const CocktailCard = () => {
  return (
    <div className="card">
      <div className="card_title">Negroni</div>

      <div className="card_body">
        <div className="card_photo"><img className="cocktail_photo" src='https://i0.wp.com/vintageamericancocktails.com/wp-content/uploads/2022/01/patricia.jpg?resize=750%2C750&ssl=1'></img></div>
        <div className="card_recipe">
            <ul className="ingredients_list">
                <li className="ingredient">1 oz Gin</li>
                <li className="ingredient">1 oz Campari</li>
                <li className="ingredient">1 oz Sweet Vermouth</li>
            </ul>
        </div>
      </div>
      <div className="card_footer"></div>
    </div>
  );
};

export default CocktailCard;
