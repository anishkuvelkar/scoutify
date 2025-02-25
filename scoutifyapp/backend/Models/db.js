const mongoose = require('mongoose');
const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url)
     .then(() => {
         console.log('Successfully connected to MongoDB');
     })
     .catch((error) => {
         console.error('Error connecting to MongoDB:', error);
     });