import React, { useState, useRef } from "react";
import "../styles/Home.css";
import { Button } from "react-bootstrap";

const CocktailForm = ({ setShowCocktailForm }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const handleSubmit = () => {
        return
    }

    const handleChange = () => {
        return
    }

  return (
    <>
      <div className="form_cocktail">
        <div className="form_cocktail_image">
          <img src="https://i0.wp.com/vintageamericancocktails.com/wp-content/uploads/2022/01/patricia.jpg?resize=750%2C750&ssl=1" alt="cocktail pic" className="form_cocktail_pic" />
        </div>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="name">Cocktail Name:</label>
            <input
              className="form-control"
              id="cocktail_name"
              name="name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="imageURL">Image URL:</label>
            <input
              className="form-control"
              id="imageURL"
              name="imageURL"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="instructions">Instructions:</label>
            <textarea
              name="instructions"
              className="form-control"
              id="instructions"
              rows="20"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <Button variant="primary" type="submit">
              Add Cocktail
            </Button>
            {errorMessage ? (
              <p className="error-message">{errorMessage}</p>
            ) : null}
          </div>
        </form>
      </div>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    </>
  );
}

export default CocktailForm;
