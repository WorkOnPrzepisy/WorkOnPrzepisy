const { Schema, model } = require("mongoose");
const mongooes = require('mongoose');
// Create Schema

const imgSchema = new mongooes.Schema({
  images: {
    strMealThumb: Buffer,
    contentType: String,
  },
  strMeal: String,

  strIngredient1: Array,

  strInstructions: String,

  _id: Schema.Types.ObjectId
});

const Img = model("Image", imgSchema);


module.exports = {
Img,
};
