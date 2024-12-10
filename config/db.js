const mongoose = require("mongoose");

const db_connection = () => {
  mongoose.connect(process.env.DB).then((res) => {
    console.log(`Database connect successfully : ${res.connection.host}`);
  });
};

module.exports = db_connection;
