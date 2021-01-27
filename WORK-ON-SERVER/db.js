const { connect } = require("mongoose");
require("dotenv").config();

const uri = 'mongodb+srv://jakub123:lubieplacki123@fork-on.ffczi.mongodb.net/<dbname>?retryWrites=true&w=majority'
const dbConnection = async () => {
  try {
    const db = await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
