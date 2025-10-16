// scripts/listUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // adjust path if needed

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    const users = await User.find().select('username role date'); // exclude password
    console.log('Registered users:');
    console.table(users);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
