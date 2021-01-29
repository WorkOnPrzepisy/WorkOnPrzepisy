const mongooes = require('mongoose');


const UserSchema = new mongooes.Schema({ 

      name:{ 
      type: String,
      required: true
      },

      email:{ 
      type: String,
      required: true
      },

      password: { 
         type: String,
         required: true
      },
      data: { 
         type: Date,
         default: Date.now
      },

      favorites: [{ type: mongooes.Schema.ObjectId, ref: 'Image' }],

      faveMeals: [{ type: String }]

}) 

const User = mongooes.model('User', UserSchema)

module.exports = User