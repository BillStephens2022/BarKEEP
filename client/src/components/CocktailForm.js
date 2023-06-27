import React, { useState, useEffect } from "react";
import "../styles/CocktailForm.css";

const initialState = {
  name: "",
  ingredients: [
    {
      name: "",
      quantity: "",
    },
  ],
  imageURL: "",
  glassware: "",
  instructions: "",
  tags: [],
};

const CocktailForm = ({
  addCocktail,
  editCocktail,
  cocktailFormState,
  setCocktailFormState,
  selectedCocktail,
  formType
}) => {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleIngredientAdd = () => {
    if (ingredientName && ingredientQuantity) {
      const newIngredient = {
        name: ingredientName,
        quantity: ingredientQuantity,
      };
      setCocktailFormState((prevState) => ({
        ...prevState,
        ingredients: [...prevState.ingredients, newIngredient],
      }));
      setIngredientName("");
      setIngredientQuantity("");
    }
  };

  const handleTagAdd = () => {
    if (tagInput) {
      setCocktailFormState((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, tagInput],
      }));
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, ingredients, imageURL, glassware, instructions, tags } =
      cocktailFormState;
    // Check if any required fields are empty
    if (!name || !ingredients.length || !tags.length) {
      console.log("Please fill in all required fields");
      return;
    }
    // Send form data to the server
    try {
      if (formType === 'add') {
        const formData = await addCocktail({
          variables: {
            name,
            ingredients,
            imageURL,
            glassware,
            instructions,
            tags,
          },
        });
        console.log(formData);
      } else {
        const formData = await editCocktail({
          variables: {
            cocktailId: selectedCocktail._id,
            name,
            ingredients,
            imageURL,
            glassware,
            instructions,
            tags,
          },
        });
        console.log(formData);
      }
      
      // Reset form fields
      setCocktailFormState(initialState);
      setIngredientName("");
      setIngredientQuantity("");
      setTagInput("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log("SELECTED COCKTAIL: ", selectedCocktail);
    if (selectedCocktail) {
      // Set the initial form state with the values of the selected cocktail
      setCocktailFormState(selectedCocktail);
    } else {
      // Reset the form state
      setCocktailFormState(initialState);
    }
    // Clean up the form state when the component is unmounted or when selectedCocktail changes
    return () => {
      setCocktailFormState({
        name: "",
        ingredients: [
          {
            name: "",
            quantity: "",
          },
        ],
        imageURL: "",
        glassware: "",
        instructions: "",
        tags: [],
      });
    };
  }, [selectedCocktail, setCocktailFormState]);

  const { name, ingredients, imageURL, glassware, instructions, tags } =
    cocktailFormState;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) =>
            setCocktailFormState((prevState) => ({
              ...prevState,
              name: e.target.value,
            }))
          }
          required
        />

        <label htmlFor="ingredients">Ingredients:</label>
        <div>
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <input type="text" value={ingredient.name} readOnly />
              <input type="text" value={ingredient.quantity} readOnly />
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Ingredient Name"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Quantity"
          value={ingredientQuantity}
          onChange={(e) => setIngredientQuantity(e.target.value)}
          required
        />
        <button type="button" onClick={handleIngredientAdd}>
          Add Ingredient
        </button>

        <label htmlFor="imageURL">Image URL:</label>
        <input
          type="text"
          id="imageURL"
          value={imageURL}
          onChange={(e) =>
            setCocktailFormState((prevState) => ({
              ...prevState,
              imageURL: e.target.value,
            }))
          }
        />

        <label htmlFor="glassware">Glassware:</label>
        <input
          type="text"
          id="glassware"
          value={glassware}
          onChange={(e) =>
            setCocktailFormState((prevState) => ({
              ...prevState,
              glassware: e.target.value,
            }))
          }
        />

        <label htmlFor="instructions">Instructions:</label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) =>
            setCocktailFormState((prevState) => ({
              ...prevState,
              instructions: e.target.value,
            }))
          }
        ></textarea>

        <label htmlFor="tags">Tags:</label>
        <div>
          {tags.map((tag, index) => (
            <div key={index}>{tag}</div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          required
        />
        <button type="button" onClick={handleTagAdd}>
          Add Tag
        </button>

        <button type="submit">{formType.charAt(0).toUpperCase() + formType.slice(1)} Cocktail</button>
      </form>
    </div>
  );
};

export default CocktailForm;
