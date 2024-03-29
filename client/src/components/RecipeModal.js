import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useMutation, useApolloClient } from "@apollo/client";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import { ADD_COCKTAIL } from "../utils/mutations";
import CocktailCard from "./CocktailCard";
import "../styles/components/RecipeModal.css";

const RecipeModal = ({ recipe, onClose }) => {
  // State variables to keep track of added cocktail and its status
  const [addedCocktailId, setAddedCocktailId] = useState(null);
  const [cocktailAdded, setCocktailAdded] = useState({});

  // Initialize the Apollo client
  const client = useApolloClient();

  // Use the ADD_COCKTAIL mutation
  const [addCocktail] = useMutation(ADD_COCKTAIL, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  useEffect(() => {
    console.log(addedCocktailId);
  }, [addedCocktailId]);

  // Function to handle adding a cocktail
  const handleAddCocktail = async (cocktailData) => {
    setAddedCocktailId(cocktailData._id);

    try {
      // Use the addCocktail mutation to add a new cocktail
      const { data } = await addCocktail({
        variables: cocktailData,
      });

      // Manually update the cache with the newly added cocktail
      const { cocktails } = client.readQuery({ query: QUERY_COCKTAILS }) || {
        cocktails: [],
      };
      client.writeQuery({
        query: QUERY_COCKTAILS,
        data: { cocktails: [data.addCocktail, ...cocktails] },
      });
      // Update cocktailAdded state to indicate that the cocktail was added
      setCocktailAdded((prev) => ({
        ...prev,
        [cocktailData._id]: true,
      }));
    } catch (error) {
      console.error("Error adding cocktail:", error);
    }
  };

  // Clone the recipe object without __typename
  const recipeWithoutTypename = { ...recipe };
  delete recipeWithoutTypename.__typename;

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{recipe.name} Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Render CocktailCard with the recipe data */}
        <CocktailCard
          cocktails={[recipeWithoutTypename]}
          page="RecipeModal"
          addCocktail
          handleAddCocktail={handleAddCocktail}
          addedCocktailId={addedCocktailId}
          cocktailAdded={cocktailAdded}
          defaultExpanded={true}
          customClass="custom-modal-card"
        />
      </Modal.Body>
    </Modal>
  );
};

export default RecipeModal;
