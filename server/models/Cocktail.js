const { Schema, model } = require("mongoose");

const cocktailSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: {
        type: String,
      },
      quantity: {
        type: String,
      },
    },
  ],
  imageURL: {
    type: String,
  },
  glassware: {
    type: String,
  },
});

const Cocktail = model("Cocktail", cocktailSchema);

module.exports = Cocktail;
