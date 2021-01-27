const express = require('express')
const router = express.Router()
const Meal = require('../models/meal')
const cors = require('cors')
router.use(cors())


// Getting all
router.get('/meals/all', async (req, res) => {
  try {
    const meals = await Meal.find()
    res.json(meals)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting by category
router.get('/meals', async (req, res) => {
  try {
    let meals;
    if (req.query.ingredients !== "") {
      const ingredients = req.query.ingredients.split(",")
      meals = await Meal.find({
        "name": {$regex: req.query.name, $options: 'i'},
        "category": {$regex: req.query.category, $options: 'i'},
        "area": {$regex: req.query.area, $options: 'i'},
        "ingredients.name": {$all: ingredients}
      })
    } else {
      meals = await Meal.find({
        "name": {$regex: req.query.name, $options: 'i'},
        "category": {$regex: req.query.category, $options: 'i'},
        "area": {$regex: req.query.area, $options: 'i'}
      })
    }
    res.json(meals)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/meals/:id', getMeal, (req, res) => {
  res.json(res.meal)
})

// Creating one
router.post('/meals', async (req, res) => {
  const meal = new Meal({
    name: req.body.name,
    _id: req.body._id,
    category: req.body.category,
    area: req.body.area,
    imageUrl: req.body.imageUrl,
    instructions: req.body.instructions,
    ingredients: req.body.ingredients
  })
  try {
    const newMeal = await meal.save()
    res.status(201).json(newMeal)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/meals/:id', getMeal, async (req, res) => {
  if (req.body.name != null) {
    res.meal.name = req.body.name
  }
  if (req.body._id != null) {
    res.meal._id = req.body._id
  }
  if (req.body.category != null) {
    res.meal.category = req.body.category
  }
  if (req.body.area != null) {
    res.meal.area = req.body.area
  }
  if (req.body.imageUrl != null) {
    res.meal.imageUrl = req.body.imageUrl
  }
  if (req.body.instructions != null) {
    res.meal.instructions = req.body.instructions
  }
  if (req.body.ingredients != null) {
    res.meal.ingredients = req.body.ingredients
  }

  try {
    const updatedMeal = await res.meal.save()
    res.json(updatedMeal)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/meals/:id', getMeal, async (req, res) => {
  try {
    await res.meal.remove()
    res.json({ message: 'Deleted Meal' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getMeal(req, res, next) {
  let meal
  try {
    meal = await Meal.findById(req.params.id)
    if (meal == null) {
      return res.status(404).json({ message: 'Cannot find meal' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.meal = meal
  next()
}


module.exports = router