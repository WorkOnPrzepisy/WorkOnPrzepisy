// const dbConnect =require("dotenv").config();
const { connect } = require("mongoose");

const uri = 'mongodb+srv://damiant94:dtHasSQnmbgPzNsU@cluster0.haa8v.mongodb.net/<dbname>?retryWrites=true&w=majority'
<<<<<<< HEAD
    //const uri = 'mongodb://127.0.0.1:27017/'
=======
// const uri = 'mongodb://127.0.0.1:27017/'
>>>>>>> 97e763dd1a64813341c30395a042a7f8055fba21


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