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
        required: true
      },
      quantity: {
        type: String,
        required: true
      },
    },
  ],
  imageURL: {
    type: String
  },
  glassware: {
    type: String
  },
  instructions: {
    type: String
  },
  tags: [
    {
      type: String,
      required: true
    }
  ]
});

const Cocktail = model("Cocktail", cocktailSchema);

module.exports = Cocktail;
