// scripts/resetPassword.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // adjust path if needed

const usernameToReset = process.argv[2]; // pass username as first argument
const newPassword = process.argv[3];     // pass new password as second argument

if (!usernameToReset || !newPassword) {
  console.error('Usage: node scripts/resetPassword.js <username> <newPassword>');
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    const user = await User.findOne({ username: usernameToReset });
    if (!user) {
      console.error('User not found');
      await mongoose.disconnect();
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log(`✅ Password for user "${usernameToReset}" has been reset to "${newPassword}"`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
