import React, { useState } from "react";
import "../styles/CocktailForm.css";


const CocktailForm = ({ setShowCocktailForm, addCocktail, cocktails, setCocktails, cocktailFormState, setCocktailFormState }) => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [glassware, setGlassware] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleIngredientAdd = () => {
    if (ingredientName && ingredientQuantity) {
      const newIngredient = {
        name: ingredientName,
        quantity: ingredientQuantity
      };
      setIngredients([...ingredients, newIngredient]);
      setIngredientName("");
      setIngredientQuantity("");
    }
  };

  const handleTagAdd = () => {
    if (tagInput) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DATA: ", {
      name,
      ingredients,
      imageURL,
      glassware,
      instructions,
      tags,
    });
    // Check if any required fields are empty
    if (!name || !ingredients.length || !tags.length) {
      console.log("Please fill in all required fields");
      return
    }
    // Send form data to the server
    try {
      const formData = await addCocktail({
        variables: {
          name,
          ingredients,
          imageURL,
          glassware,
          instructions,
          tags,
        }
      });
      console.log(formData);
      // Reset form fields
      setName("");
      setIngredients([]);
      setIngredientName("");
      setIngredientQuantity("");
      setImageURL("");
      setGlassware("");
      setInstructions("");
      setTags([]);
      setTagInput("");
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          onChange={(e) => setImageURL(e.target.value)}
        />

        <label htmlFor="glassware">Glassware:</label>
        <input
          type="text"
          id="glassware"
          value={glassware}
          onChange={(e) => setGlassware(e.target.value)}
        />

        <label htmlFor="instructions">Instructions:</label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CocktailForm;