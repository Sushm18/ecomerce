const mongoose = require('mongoose');

const connectDatabase = () => {
  const dbURL = 'mongodb://localhost:27017/e-shop'|| process.env.DB_URL ;

  mongoose.connect(dbURL)
  .then((data) => {
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  })
  .catch((err) => {
    console.error('Error while connecting with MongoDB:', err.message);
  });
};

module.exports = connectDatabase;
