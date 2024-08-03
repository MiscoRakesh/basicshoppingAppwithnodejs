const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_CONNECTION_URL);
    console.log(" DB connected !!!! ");
  } catch (error) {
    console.log("ERR From DB ::::", error);
  }
};

module.exports=  dbConnect;