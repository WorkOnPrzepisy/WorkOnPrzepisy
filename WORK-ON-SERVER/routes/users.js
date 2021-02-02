const express =require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcryptjs')
const expressLayouts = require("express-ejs-layouts");
const app = express()
const middleware = require('../config/verify')



app.set('layout', 'layoutLogin', 'layout', 'userLayout');

router.use(expressLayouts) 


router.get('/login', (req,res)=> res.render('login',{ layout: 'layoutLogin'}))

router.get('/register',  (req,res)=> res.render('register',{ layout: 'layoutLogin'}))

router.get('/images',(req,res)=> res.render('images',{ layout: 'layoutLogin'}))

router.get('/forgotten', (req,res)=> res.render('forgotten',{ layout: 'layoutLogin'}))

router.get('/home',middleware, (req,res)=> res.render('usersHome',{ layout: 'userLayout'}))

router.get('/user-images', (req,res)=> res.render('user-images',{ layout: 'userLayout'}))

router.get('/happines', (req,res)=> res.render('users-happines',{ layout: 'userLayout'}))

router.get('/more-added', (req,res)=> res.render('more-added',{ layout: 'userLayout'}))

router.get('/fluke', (req,res)=> res.render('users-happines',{ layout: 'userLayout'}))

router.get('/search-view', (req,res)=> res.render('search-view',{ layout: 'userLayout'}))

router.get('/user-fave', (req,res)=> res.render('user-fave',{ layout: 'userLayout'}))

router.get('/see-more', (req,res)=> res.render('see-more',{ layout: 'userLayout'}))

router.get('/basket', (req,res)=> res.render('basket',{ layout: 'userLayout'}))



// register Handler
router.post('/register', (req,res)=>{ 
  const {name,email,password,password2} = req.body;
  console.log(name,email,password);
  
  let errors =[]

//   check fields
  if(!name || !email ||!password || !password2){ 
   errors.push({msg:"Please fill in all fields"})
  } 

//   check password match
  if(password !== password2){ 
   errors.push({msg: "password do not match"})
  } 

//   Check pass length
if(password.length < 6){ 
   errors.push({msg: "Password should ne at least 6 characters"})
} 

if(errors.length > 0){ 
   res.render('register',{ 
      errors,
      email,
      password,
      password2
   })
} else { 
   // Validation
   User.findOne({ email : email})
   .then(user => { 
      if(user){  
         // User exists
         errors.push({msg: "Email is alrady registered"})
         res.render('register',{ 
            errors,
            email,
            password,
            password2
         })
      } else { 

         const newUser = new User({ 
            name,
            email,
            password,
            password2
         }) 
         
         bcrypt.genSalt(10, (err,salt) => 
            bcrypt.hash(newUser.password,salt ,(err,hash)=>{ 
               if(err) throw err;
               newUser.password = hash

               newUser
               .save()
               .then(user=> { 
                  req.flash('success_msg', 'You are now registered')
                  res.redirect('/users/login')
               }) 
               .catch(err=> console.log(err))
            }
            ))}
   })
}
}) 


router.post('/forgotten', async (req, res) => { 
   const { email, password, password2 } = req.body;
      let errors =[]

   if( !email ||!password || !password2){ 
      errors.push({msg:"Please fill in all fields"})
     } 
   
   //   check password match
     if(password !== password2){ 
      errors.push({msg: "password do not match"})
     } 
   
   //   Check pass length
   if(password.length < 6){ 
      errors.push({msg: "Password should be at least 6 characters"})
   } 
   
   if(errors.length > 0){ 
      res.render('forgotten',{ 
         errors,
         email,
         password,
         password2
      })
   }
   
   try {
      const user = await User.findOne({ email: email }).exec();
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password2, salt);

      user.password = passwordHash;
      await user.save().then()
         req.flash('success_msg', 'You have changed your password, Now u can log in  ')
         res.redirect('/users/login')
   } 
      catch (error) {
      console.error(error);
   }
});

// Login Handle


router.post('/login', async (req, res, next) => {
   
   try {
      const {email, password} = req.body;
      const user = await  User.findOne({email});
 
      if(!user || user === null) {
       return res.redirect("/users/login")
      }
      else {
       const isMatch = await bcrypt.compare(password, user.password);
       if(!isMatch){ 
          req.flash('error', 'Incorrrect Password')
          res.redirect("/users/login")

     }
      else {
         req.session.user = user._id
         res.redirect("/users/home");
         
    }
      }
      
   } catch (error) {
      console.log(error)
   }
});
router.get('/logout', (req,res)=>{ 
   req.flash('success_msg', 'You are logged out')
   res.redirect("/users/login")
   //  req.logout()
}) 







module.exports = router