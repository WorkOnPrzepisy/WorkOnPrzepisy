const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  _id: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  }
  ,
  ingredients: {
    type: [{
      name: String,
      measure: String
    }],
    required: true
  }
},{_id: false})

module.exports = mongoose.model('Meal', mealSchema)