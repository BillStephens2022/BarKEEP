import React from "react";
import Modal from "react-bootstrap/Modal";
import CocktailCard from "./CocktailCard"; // Import your CocktailCard component

const RecipeModal = ({ recipe, onClose }) => {
    console.log("RECIPE", recipe);
    const recipeWithoutTypename = { ...recipe };
    delete recipeWithoutTypename.__typename;
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{recipe.name} Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CocktailCard cocktails={[recipeWithoutTypename]} page="SearchCocktails" />
      </Modal.Body>
    </Modal>
  );
};

export default RecipeModal;