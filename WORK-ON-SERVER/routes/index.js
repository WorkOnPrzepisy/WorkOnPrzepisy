const express =require('express')
const router = express.Router()

router.get('/', (req,res)=> res.render('base',{layout:'layout'}))

router.get('/fluke', (req,res)=> res.render('fluke',{layout: 'layout'}))

router.get('/search-view', (req,res)=> res.render('search-view',{layout: 'layout'}))

router.get('/basket', (req,res)=> res.render('basket',{layout: 'layout'}))

router.get('/newly-added', (req,res)=> res.render('newly-added',{layout: 'layout'}))







 
module.exports = router