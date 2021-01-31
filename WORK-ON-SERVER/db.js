// const dbConnect =require("dotenv").config();
const { connect } = require("mongoose");

<<<<<<< HEAD
// const uri = 'mongodb+srv://damiant94:dtHasSQnmbgPzNsU@cluster0.haa8v.mongodb.net/<dbname>?retryWrites=true&w=majority'
const uri = 'mongodb://127.0.0.1:27017/'
=======
const uri = 'mongodb+srv://damiant94:dtHasSQnmbgPzNsU@cluster0.haa8v.mongodb.net/<dbname>?retryWrites=true&w=majority'
    // const uri = 'mongodb://127.0.0.1:27017/'
>>>>>>> e91ca22b0856ca023b255a6a60b0e8b9eefe4536



const dbConnection = async() => {
    try {
        const db = await connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: ""
        });

        if (db) {
            console.log("mongoDB connected");
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    dbConnection,
};