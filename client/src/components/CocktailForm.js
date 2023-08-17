import React, { useState, useEffect } from "react";
import UploadWidget from "./UploadWidget";
import "../styles/components/CocktailForm.css";

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
  // State variables for ingredient and tag inputs
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  
  // Function to handle adding an ingredient to the form state
  const handleIngredientAdd = () => {
    // Validate ingredient input
    if (ingredientName && ingredientQuantity) {
      const newIngredient = {
        name: ingredientName,
        quantity: ingredientQuantity,
      };
      // Update form state and reset input fields
      setCocktailFormState((prevState) => ({
        ...prevState,
        ingredients: [...prevState.ingredients, newIngredient],
      }));
      setIngredientName("");
      setIngredientQuantity("");
    }
  };

  // Function to handle adding a tag to the form state
  const handleTagAdd = () => {
    // Validate tag input
    if (tagInput) {
      // Update form state and reset input field
      setCocktailFormState((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, tagInput],
      }));
      setTagInput("");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, ingredients, glassware, instructions, tags } =
      cocktailFormState;
    // Check if any required fields are empty
    if (!name || ingredients.length === 0 || tags.length === 0 || !imageUploaded) {
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

    // Send form data to the server for either adding or editing
    try {
      // If an image has been uploaded, use its secure_url in the form submission
      let imageURL = cocktailFormState.imageURL; // Default to the URL input value

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

      // Reset form fields and state after submission
      setImageUploaded(null);
      setCocktailFormState(initialState);
      setIngredientName("");
      setIngredientQuantity("");
      setTagInput("");
      setShowCocktailForm(false);
    } catch (err) {
      console.error(err);
    }
  };
  
  // UseEffect to set form state based on selected cocktail
  useEffect(() => {
     // If editing a cocktail, populate form fields with selected cocktail's data
    if (selectedCocktail) {
      // Create a deep copy of the ingredients array
      const initialIngredients = JSON.parse(
        JSON.stringify(selectedCocktail.ingredients)
      );
      // Update the form state with selected cocktail's data
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
      // Reset the form state if no cocktail is selected
      setCocktailFormState(initialState);
    }
    // Clean up the form state when the component is unmounted or when selectedCocktail changes
    return () => {
      // reset the form state
      setCocktailFormState(initialState);
      setIngredientName("");
      setIngredientQuantity("");
      setTagInput("");
    };
  }, [selectedCocktail, setCocktailFormState]);
  
  // Destructuring form state values
  const { name, ingredients, glassware, instructions, tags } =
    cocktailFormState;

  // Function to handle ingredient input change
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
  const handleUploadSuccess = (result) => {
    if (result && result.event === "success") {      
      console.log("Done! Here is the image info: ", result.info);
      console.log("secure_url: ", result.info.secure_url);
      // Update form state with uploaded image URL
      setCocktailFormState((prevState) => ({
        ...prevState,
        imageURL: result.info.secure_url,
      }));
      // Handle image format conversion if needed
      const convertedUrl = result.info.secure_url.replace(/\.heic$/, ".jpg");
      if (convertedUrl.length > 0) {
        setImageUploaded(true);
      };
      setUploadedImageURL(convertedUrl);
    } else {
      setImageUploaded(false);
      setUploadedImageURL("");
    }
  };

  return (
    <div className="form-container">
      <form className="cocktail-form" onSubmit={handleSubmit}>
        {/* ... Input fields for the form */}
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

        <button
          type="button"
          onClick={handleIngredientAdd}
          className="add-ingredient-button"
        >
          Add Ingredient
        </button>

        <label htmlFor="imageURL">Image:</label>
        <UploadWidget onSuccess={handleUploadSuccess} />

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
        <button type="button" onClick={handleTagAdd} className="add-tag-button">
          Add Tag
        </button>

        <button
          type="submit"
          className="btn cocktail-form-button"
          disabled={!imageUploaded}
        >
          {formType.charAt(0).toUpperCase() + formType.slice(1)} Cocktail
        </button>
      </form>
    </div>
  );
};

export default CocktailForm;
