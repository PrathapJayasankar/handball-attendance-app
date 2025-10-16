// server/config/db.js

const mongoose = require('mongoose');

// 💡 FIX: The 'db' variable MUST be defined outside the function 
// so it is available to the entire file (global scope).
const db = process.env.MONGO_URI; 

const connectDB = async () => {
  try {
    // This line now correctly accesses the 'db' variable from above.
    console.log('Attempting to connect with URI:', db); 
    
    // The connection uses the URI string stored in the 'db' variable.
   mongoose.connect(process.env.MONGO_URI);


    console.log('MongoDB Connected Successfully!');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1); 
  }
};

module.exports = connectDB;