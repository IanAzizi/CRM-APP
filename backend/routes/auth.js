const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();
// ✅ ثبت‌نام کاربر جدید

router.post('/register', async (req, res) => {
  try {
    let { name, username, password, role } = req.body;

    name = name.trim();
    username = username.trim();
    password = password.trim();
    role = role.trim();

    if (!name || !username || !password || !role) {
      return res.status(400).json({ message: 'همه‌ی فیلدها الزامی هستند' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'نام کاربری قبلاً استفاده شده است' });
    }

    const newUser = new User({ name, username, password, role }); // ❌ بدون هش کردن
    await newUser.save();

    console.log('✅ کاربر جدید ساخته شد:', username);
    res.status(201).json({ message: '✅ کاربر با موفقیت ثبت شد' });
  } catch (err) {
    console.error('❌ Register Error:', err.message);
    res.status(500).json({ message: 'خطای سرور', error: err.message });
  }
});


// ✅ ورود (Login)
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;

    // حذف فاصله‌های اشتباهی
    username = username.trim();
    password = password.trim();

    console.log('📥 Login attempt:', username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(400).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
    }

    console.log('🔍 Found user:', user.username);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      message: '✅ ورود موفقیت‌آمیز بود',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ message: 'خطای سرور', error: err.message });
  }
});

module.exports = router;