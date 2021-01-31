const express = require("express");
const morgan = require("morgan");
const sharp = require("sharp");
const {
   dbConnection
} = require("./db");
const {
   upload
} = require("./multer");
const {
   Img
} = require("./models/index");
const expresssLayouts = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')

const User = require('./models/User')
const MongoDBStore = require('connect-mongodb-session')(session);

const Port = process.env.PORT || 7000;
const app = express();
const nodeFetch = require('./node-fetch')
const nodeFetchApiName = require('./nodeFetchApi');



app.set("view engine", "ejs");
app.use('/public', express.static('public'))
app.set('layout', 'layoutLogin')


app.use(express.json());
app.use(morgan("tiny"));



app.use(express.urlencoded({
   extended: true
}));

app.use(flash())


const store = new MongoDBStore({
   // uri: 'mongodb://127.0.0.1:27017/',
   uri: 'mongodb+srv://damiant94:dtHasSQnmbgPzNsU@cluster0.haa8v.mongodb.net/<dbname>?retryWrites=true&w=majority',
   collection: 'mySessions'
});


app.use(session({

   resave: false,
   saveUninitialized: true,
   secret: '1234567890QWERT',
   cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: false,
      path: '/'
   },
   store: store

}))




app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg')
   res.locals.error_msg = req.flash('error_msg')
   res.locals.error = req.flash('error')
   next()
})


app.use(expresssLayouts)



app.get("/", async (req, res) => {
   try {
      const files = await Img.find();
      const arrayfile1 = Array.from(files).slice(Math.max(files.length - 3, 0))
      const arrayfile = arrayfile1.reverse()
      res.render('base', {
         arrayfile,
         layout: 'layout'
      });
   } catch (error) {
      console.log(error);
   }
});


app.get("/users/home", async (req, res) => {
   try {
      const files = await Img.find();
      const array = Array.from(files).slice(Math.max(files.length - 3, 0))
      const arrayfile = array.reverse()
      res.render('usersHome', {
         arrayfile,
         layout: 'userLayout'
      });
   } catch (error) {
      console.log(error);
      // res.render('error', { message: "dupa"})
   }
});

app.get("/users/fluke_id", async (req, res) => {
   try {
      const db_id = req.query.db_id;

      if (db_id) {
         const imgDb = await Img.findById(db_id);

         const img = {
            ...imgDb.toObject(),
            images: {
               strMealThumb: Buffer.from(imgDb.images.strMealThumb.buffer).toString("base64")
            }
         };

         res.status(200);
         res.send(img);
      } else {
         throw "NIE PODANO PARAMETRU";
      }
   } catch (error) {
      console.log(error);
   }
});

app.get("/newly-added", async (req, res) => {
   try {
      const arrayfile1 = await Img.find({}).exec();
      const arrayfile = await arrayfile1.reverse()
      res.render("newly-added", {
         layout: "layout",
         arrayfile
      });
   } catch (error) {
      console.log(error);
   }
});



app.get("/users/more-added", async (req, res) => {
   try {

      const arrayfile1 = await Img.find({}).exec();
      const arrayfile = await arrayfile1.reverse()
      res.render("more-added", {
         layout: "userLayout",
         arrayfile
      });
   } catch (error) {
      console.log(error);
   }
});



// SAVE IMAGES FROM API 
app.post('/users/user-images', async (req, res) => {
   try {

      const data = await req.body._id
      const userId = req.session.user
      console.log(data);
      console.log(userId);
      const currentLoggedUser = await User.findOne({
         _id: userId
      }).exec()
      const faveMeals = await currentLoggedUser.faveMeals
      await faveMeals.push(data)
      currentLoggedUser.save()
      console.log('Image saved Corretly');

   } catch (error) {
      console.log(error);
   }
})

// NODEFETCH ITERATION
app.get('/users/user-images', async (req, res) => {
   const userId = req.session.user
   const userFound = await User.find(userId).exec()
   const faveMeals = await userFound[0].faveMeals
   // THIS COMES FROM DATABSE FAVORITES
   const faveImages = userFound[0].favorites
   const images = await Img.find({
      _id: {
         $in: faveImages
      }
   })

   const faveIdNum = await faveMeals.map((idMeal) => Number(idMeal))
   const result = await nodeFetch(faveIdNum)
   console.log(userFound);
   const resultt = result.map(result => result.meals[0])
   const results = resultt.reverse()
   res.render('user-images', {
      layout: 'userLayout',
      results,
      images
   })

})


//UPLAODSS FILES BY LOGGED USERS FROM THERM FOVORITES

app.post('/users/favorites', async (req, res) => {
   const {
      name
   } = await req.body
   const userId = req.session.user
   const loggedUser = await User.find(userId).exec()
   const imgFavorites = loggedUser[0].favorites
   const imgApiFavorites = loggedUser[0].faveMeals
   const arrayofFavorites = await Img.find({
      _id: {
         $in: imgFavorites
      }
   }) 

   // DATABSE RESULTS
   const faveIdNum = await imgApiFavorites.map((idMeal) => Number(idMeal))

   const dataBaseResultsName = await arrayofFavorites.map((name) => {
      return {
         strMeal: name.strMeal,
         _id: name._id,
         img: name.images.strMealThumb
      }
   }) 
   console.log(dataBaseResultsName);

   // API NAME RESULTS []
   const apiFetchResult = await nodeFetchApiName(faveIdNum)
   const arrayAPI = apiFetchResult.map((item) => item.meals[0])



   // SINGLE RESULT BY NAME

   function findKey(arr, strName) {
      // Loop over the array
      for (var i = 0; i < arr.length; i++) {
         for (var key in arr[i]) {
            if (arr[i][key] == strName) {
               const arrayDATA = arr[i]
               const img = {
                  ...arrayDATA,
                  images: {
                     imgThumb: Buffer.from(arrayDATA.img.buffer).toString('base64')
                  }
               }
               return img

            }
         }
      }
   }
   const apiName = (array, strName) => {

      for (var i = 0; i < array.length; i++) {
         if (array[i].strMeal === strName) {
            return arrayAPI[i]
         }
      }
   }
   const obj = {
      key: await findKey(dataBaseResultsName, name),
      key1: await apiName(arrayAPI, name)
   }

   res.status(200);
   res.send(obj)

})


// MORE-ADDED BY USERS SEARCH-FROM INPUT
app.post('/more-added-search', async (req, res) => {
   const {
      name
   } = await req.body
   const userId = req.session.user
   const loggedUser = await User.find(userId).exec()
   const imgFavorites = loggedUser[0].favorites
   const arrayofFavorites = await Img.find({
      _id: {
         $in: imgFavorites
      }
   })



   // DATABSE RESULTSTS   
   const dataBaseResultsName = await arrayofFavorites.map((name) => {
      return {
         name: name.strMeal,
         _id: name._id,
         img: name.images.strMealThumb
      }
   })



   // SINGLE RESULT BY NAME

   function findKey(arr, strName) {
      // Loop over the array
      for (var i = 0; i < arr.length; i++) {
         for (var key in arr[i]) {
            if (arr[i][key] === strName) {
               const arrayDATA = arr[i]
               const img = {
                  ...arrayDATA,
                  images: {
                     imgThumb: Buffer.from(arrayDATA.img.buffer).toString('base64')
                  }
               }
               return img

            }
         }
      }
   }

   const obj = {
      key: await findKey(dataBaseResultsName, name)
   }



   res.status(200);
   res.send(obj)

})







// ADD IMAGES TO FAVORITES FROM DATABASE
app.post("/newly-added/:id", async (req, res) => {
   try {
      const _id = req.session.user
      const {
         id
      } = req.params
      const user = await User.findOne({
         _id: _id
      }).exec()
      const array = user.favorites.push(id)
      await user.save().then(function (err, result) {
         console.log('Image created');
      })
      res.redirect('/newly-added')
   } catch (error) {
      console.log(error);
   }
});



// CREATEING IMAGE FOR USER
app.post("/users/images", upload.any("images"), async (req, res) => {
   try {
      const imgFile = req.files[0].path;
      console.log(imgFile);
      const {
         strMeal,
         strInstructions,
         strIngredient1
      } = req.body;
      const strMealThumb = await sharp(imgFile).toFormat("jpeg").toBuffer();

      const arraySplit = strIngredient1.split(",")
      const strIngredient = arraySplit.map((item, index) => {
         jsObj = {};
         jsObj[`strIngridient${index+1}`] = item;
         return jsObj;
      });

      const newPost = {
         strMeal,
         strInstructions,
         strIngredient1: strIngredient,
         images: {
            strMealThumb
         },
         _id: new mongoose.Types.ObjectId()
      };

      await Img.create(newPost);
      req.flash('success_msg', 'You have uploaded your dish on the page! Congrats!')
      res.redirect("/users/images");
   } catch (error) {
      console.log(error);
   }
});




// SAVE IMAGES BY LOGGED USERS  , IMAGES CAME FROM API
app.post('/users/user-images', async (req, res) => {
   try {

      const data = await req.body._id
      const userId = req.session.user
      console.log(data);
      const currentLoggedUser = await User.findOne({
         _id: userId
      }).exec()
      const faveMeals = await currentLoggedUser.faveMeals
      await faveMeals.push(data)
      currentLoggedUser.save()
      console.log(faveMeals);
   } catch (error) {
      console.log(error);
   }
})


// SAVING FILES FROM databse 
app.post('/userek/fave', async (req, res) => {
   try {
      const {
         id
      } = await req.body
      const userId = req.session.user
      const currentLoggedUser = await User.findOne({
         _id: userId
      }).exec()
      const faveMeals = await currentLoggedUser.favorites
      await faveMeals.push(id)
      currentLoggedUser.save()
      console.log('Image SAVED' + faveMeals);

   } catch (error) {
      console.log(error);
   }
})



// Routing
app.use('/', require('./routes/index.js'))
app.use('/users', require('./routes/users.js'))




app.listen(Port, () => {
   dbConnection();
   console.log(`Server is listening on port: ${Port}`);
});