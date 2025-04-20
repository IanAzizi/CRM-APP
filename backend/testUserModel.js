require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Connected to MongoDB");

    //create user 
        const newUser = new User({
      name: "Ali Azizi",
      username: "azizi123",
      password: "123456", // این رمز هش میشه اتومات
      role: "supervisor"
    });

    await newUser.save();
    console.log("✅ User created:", newUser);

    // test password
        const isMatch = await newUser.comparePassword("123456");
    console.log("🔐 Password match:", isMatch);

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err.message);
    mongoose.disconnect();
  }
}

test();
