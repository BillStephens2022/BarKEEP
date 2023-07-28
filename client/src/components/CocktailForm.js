import React, { useState, useEffect } from "react";
import UploadWidget from "./UploadWidget";
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
  formType,
  setShowCocktailForm,
  setCocktails,
}) => {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const isSubmitDisabled = !uploadedImage || !uploadedImage.secure_url;

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
    const { name, ingredients, glassware, instructions, tags } =
      cocktailFormState;
    // console.log for debugging purposes
    console.log("Mutation Variables:", {
      name,
      ingredients,
      imageURL,
      glassware,
      instructions,
      tags,
    });
    // Check if any required fields are empty
    if (!name || ingredients.length === 0 || tags.length === 0) {
      console.log("Please fill in all required fields");
      return;
    }

    // Check if at least one ingredient (name and quantity) is added
    const hasValidIngredient = ingredients.some(
      (ingredient) => ingredient.name && ingredient.quantity
    );
    if (!hasValidIngredient) {
      console.log("Please add at least one ingredient");
      return;
    }

    // Check if at least one tag is added
    const hasValidTag = tags.some((tag) => tag.trim() !== "");
    if (!hasValidTag) {
      console.log("Please add at least one tag");
      return;
    }
    // Send form data to the server
    try {
      // If an image has been uploaded, use its secure_url in the form submission
      let imageURL = cocktailFormState.imageURL; // Default to the URL input value
      if (uploadedImage && uploadedImage.secure_url) {
        imageURL = uploadedImage.secure_url.replace(/\.heic$/, ".jpg");
      }
      if (formType === "add") {
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
      setUploadedImage(null);
      setCocktailFormState(initialState);
      setIngredientName("");
      setIngredientQuantity("");
      setTagInput("");
      setShowCocktailForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log("SELECTED COCKTAIL: ", selectedCocktail);
    if (selectedCocktail) {
      // Create a deep copy of the ingredients array
      const initialIngredients = JSON.parse(
        JSON.stringify(selectedCocktail.ingredients)
      );

      setCocktailFormState((prevState) => ({
        ...prevState,
        name: selectedCocktail.name,
        ingredients: initialIngredients,
        imageURL: selectedCocktail.imageURL,
        glassware: selectedCocktail.glassware,
        instructions: selectedCocktail.instructions,
        tags: selectedCocktail.tags,
      }));
    } else {
      // Reset the form state
      setCocktailFormState(initialState);
    }
    // Clean up the form state when the component is unmounted or when selectedCocktail changes
    return () => {
      setUploadedImage(null);
      setCocktailFormState(initialState);
      setIngredientName("");
      setIngredientQuantity("");
      setTagInput("");
    };
  }, [selectedCocktail, setCocktailFormState]);

  const { name, ingredients, imageURL, glassware, instructions, tags } =
    cocktailFormState;

  const handleIngredientChange = (index, field, value) => {
    setCocktailFormState((prevState) => {
      const updatedIngredients = [...prevState.ingredients];
      updatedIngredients[index][field] = value;

      // Remove the __typename field
      delete updatedIngredients[index].__typename;

      return {
        ...prevState,
        ingredients: updatedIngredients,
      };
    });
  };

    // Handler for successful image upload from UploadWidget
    const handleImageUploadSuccess = (result) => {
      setUploadedImage(result.info);
    };
  

  return (
    <div className="form-container">
      <form className="cocktail-form" onSubmit={handleSubmit}>
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
        />

        <label htmlFor="ingredients">Ingredients:</label>
        <div>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-inputs">
              <input
                type="text"
                value={ingredient.quantity}
                placeholder="Quantity"
                className="quantity-input"
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
              />
              <input
                type="text"
                value={ingredient.name}
                placeholder="Ingredient Name"
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
              />
            </div>
          ))}
        </div>
        <div className="ingredient-inputs">
          <input
            type="text"
            placeholder="Quantity"
            value={ingredientQuantity}
            className="quantity-input"
            onChange={(e) => setIngredientQuantity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ingredient Name"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
          />
        </div>

        <button type="button" onClick={handleIngredientAdd} className="add-ingredient-button">
          Add Ingredient
        </button>

        <label htmlFor="imageURL">Image:</label>
        <UploadWidget onSuccess={handleImageUploadSuccess} />
        {uploadedImage && uploadedImage.secure_url && (
          <img src={uploadedImage.secure_url} alt="Cocktail" />
        )}

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
        />
        <button type="button" onClick={handleTagAdd} className="add-tag-button" >
          Add Tag
        </button>

        <button type="submit" className="btn cocktail-form-button" disabled={isSubmitDisabled}>
          {formType.charAt(0).toUpperCase() + formType.slice(1)} Cocktail
        </button>
      </form>
    </div>
  );
};

export default CocktailForm;
