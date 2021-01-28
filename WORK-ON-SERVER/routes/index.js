const express =require('express')
const router = express.Router()




router.get('/', (req,res)=> res.render('base',{layout:'layout'}))

router.get('/fluke', (req,res)=> res.render('fluke',{layout: 'layout'}))

router.get('/search-view', (req,res)=> res.render('search-view',{layout: 'layout'}))

// router.get('/newly-added', (req,res)=> res.render('newly-added',{layout: 'layoutLogin'}))

router.get('/basket', (req,res)=> res.render('basket',{layout: 'layout'}))



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