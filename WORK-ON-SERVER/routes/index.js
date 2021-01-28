const express =require('express')
const router = express.Router()




router.get('/', (req,res)=> res.render('base',{layout:'layout'}))

router.get('/fluke', (req,res)=> res.render('fluke',{layout: 'layout'}))

router.get('/search-view', (req,res)=> res.render('search-view',{layout: 'layout'}))

// router.get('/newly-added', (req,res)=> res.render('newly-added',{layout: 'layoutLogin'}))

router.get('/basket', (req,res)=> res.render('basket',{layout: 'layout'}))

/// meals database - Damian

const Meal = require('../models/meal.js')


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


// Getting Random
router.get('/meals/random', async (req, res) => {
  
  try {
    // const meal = await Meal.aggregate([{$sample: {size: 1}}]);
    const meal = await Meal.aggregate([{$sample: {size: 1}}]);
    res.json(meal)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// Getting One
router.get('/meals/:id', getMeal, (req, res) => {
  res.json(res.meal)
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



// router.get('/dashboard', (req,res)=> res.render('base',{layout: 'layoutLogin'}))

const middleware = async (req, res, next) => {
   // console.log(req);
   try{
      
      if(!req.session.user) {
         res.redirect("/")
      }
      else {
         next()
      }  
   }catch(error){
      console.log(error);
      
   }
} 
router.get('/users/home',middleware, (req,res)=> res.render('usersHome',{layout: 'userLayout'}))


module.exports = router