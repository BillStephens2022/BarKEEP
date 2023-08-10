import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useMutation, useApolloClient } from "@apollo/client";
import { QUERY_ME, QUERY_COCKTAILS } from "../utils/queries";
import { ADD_COCKTAIL } from "../utils/mutations";
import CocktailCard from "./CocktailCard"; // Import your CocktailCard component

const RecipeModal = ({ recipe, onClose }) => {
  const [addedCocktailId, setAddedCocktailId] = useState(null);
  const [cocktailAdded, setCocktailAdded] = useState({});
  const client = useApolloClient();
  const [addCocktail] = useMutation(ADD_COCKTAIL, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  useEffect(() => {
    console.log(addedCocktailId);
  }, [addedCocktailId]);

  const handleAddCocktail = async (cocktailData) => {
    console.log(cocktailData._id);

    // if (!cocktailData.ingredients.length) {
    //   const searchData = await searchCocktails(cocktailData.name);
    //   cocktailData = searchData[0];
    //   setAddedCocktailId(cocktailData._id);
    // }
    setAddedCocktailId(cocktailData._id);
    console.log(addedCocktailId);
    console.log("Cocktail data:", cocktailData);
    try {
      const { data } = await addCocktail({
        variables: cocktailData,
      });
      console.log("Cocktail added: ", data.addCocktail);

      // Manually update the cache with the newly added cocktail
      const { cocktails } = client.readQuery({ query: QUERY_COCKTAILS }) || {
        cocktails: [],
      };
      client.writeQuery({
        query: QUERY_COCKTAILS,
        data: { cocktails: [data.addCocktail, ...cocktails] },
      });
      setCocktailAdded((prev) => ({
        ...prev,
        [cocktailData._id]: true,
      }));
    } catch (error) {
      console.error("Error adding cocktail:", error);
    }
  };
  console.log("RECIPE", recipe);
  const recipeWithoutTypename = { ...recipe };
  delete recipeWithoutTypename.__typename;
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{recipe.name} Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CocktailCard
          cocktails={[recipeWithoutTypename]}
          page="SearchCocktails"
          addCocktail
          handleAddCocktail={handleAddCocktail}
          cocktailAdded
        />
      </Modal.Body>
    </Modal>
  );
};

export default RecipeModal;
