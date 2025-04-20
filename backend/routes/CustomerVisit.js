const express = require('express');
const router = express.Router();
const CustomerVisit = require('../models/CustomerVisit');
const auth = require('../Middleware/auth');
const ExcelJS = require('exceljs');
const { toJalaali } = require('jalaali-js');

// POST /api/customerVisit
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, time, description, location } = req.body;

    const newVisit = new CustomerVisit({
      fullName,
      phone,
      time,
      description,
      location
    });

    await newVisit.save();
    res.status(201).json({ message: 'ثبت شد', visit: newVisit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در ذخیره اطلاعات' });
  }
});

// GET /api/customerVisit/all
// GET /api/customerVisit/all
router.get('/all', async (req, res) => {
    try {
      const visits = await CustomerVisit.find().sort({ time: -1 });
      res.status(200).json({ visits });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'خطا در دریافت لیست بازدیدها' });
    }
  });
  
// GET /api/customerVisit/export/excel
router.get('/export/excel', auth, async (req, res) => {
  try {
    if (!req.user.role || req.user.role !== 'manager') {
      return res.status(403).json({ message: 'شما مجاز به دریافت خروجی نیستید' });
    }

    const visits = await CustomerVisit.find().sort({ time: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('گزارش بازدید مشتریان');

    worksheet.columns = [
      { header: 'نام', key: 'fullName', width: 20 },
      { header: 'شماره تماس', key: 'phone', width: 15 },
      { header: 'توضیحات', key: 'description', width: 30 },
      { header: 'موقعیت', key: 'location', width: 20 },
      { header: 'زمان (تاریخ شمسی)', key: 'time', width: 20 },
    ];

    visits.forEach((v) => {
      const date = new Date(v.time);
      const jDate = toJalaali(date);
      const formatted = `${jDate.jy}/${jDate.jm}/${jDate.jd} - ${date.toLocaleTimeString('fa-IR')}`;
      
      worksheet.addRow({
        fullName: v.fullName,
        phone: v.phone,
        description: v.description,
        location: v.location,
        time: formatted,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=customer_visits.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'خطا در ایجاد فایل اکسل', error: err.message });
  }
});

module.exports = router;
