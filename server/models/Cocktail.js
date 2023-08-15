const { Schema, model } = require("mongoose");

// Define the schema for cocktails
const cocktailSchema = new Schema({
  // Name of the cocktail
  name: {
    type: String,
    required: true,
  },
  // List of ingredients with ingredient name and quantity
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: String,
        required: true
      },
    },
  ],
  // URL of the cocktail's associated image ('secure_url' from Cloudinary)
  imageURL: {
    type: String
  },
  // Type of glassware used for serving the cocktail
  glassware: {
    type: String
  },
  // Instructions for preparing the cocktail
  instructions: {
    type: String
  },
  // List of tags describing the cocktail (e.g., "classic", "fruity")
  tags: [
    {
      type: String,
      required: true
    }
  ]
});

// Create the Cocktail model
const Cocktail = model("Cocktail", cocktailSchema);

// Export the Cocktail model
module.exports = Cocktail;
