const express = require('express');
const StoreVisit = require('../models/StoreVisit');
const authMiddleware = require('../Middleware/auth');
const auth = require('../Middleware/auth');

const router = express.Router();
const ExcelJS = require('exceljs');

// ثبت ورود و خروج فروشگاه
router.post('/submit', authMiddleware, async (req, res) => {
  try {

// درست:
const { storeName, storePlate, date, checkIn, checkOut } = req.body;

if (!storeName || !storePlate || !date || !checkIn || !checkOut) {
  return res.status(400).json({ message: 'لطفاً همه فیلدهای الزامی را پر کنید' });
}

const newVisit = new StoreVisit({
  storeName,
  storePlate,
  date,
  checkIn,
  checkOut,
  createdBy: req.user.id,
});


    await newVisit.save();
    res.status(201).json({ message: 'ورود و خروج فروشگاه ثبت شد' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});
router.get('/all', auth, async (req, res) => {
    try {
      if (!req.user.role || req.user.role !== 'manager') {
        return res.status(403).json({ message: 'شما مجوز دسترسی به این بخش را ندارید' });
      }
  
      const visits = await StoreVisit.find().populate('createdBy', 'name username role');

      res.json({ visits });
    } catch (err) {
      res.status(500).json({ message: 'خطای سرور', error: err.message });
    }
  });


  router.get('/export/excel', auth, async (req, res) => {
    if (!req.user.role || req.user.role !== 'manager') {
      return res.status(403).json({ message: 'شما مجاز به دریافت خروجی نیستید' });
    }
  
    try {
        const visits = await StoreVisit.find().populate('createdBy', 'name username');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('گزارش بازدید فروشگاه');
        
        worksheet.columns = [
          { header: 'نام', key: 'name', width: 20 },
          { header: 'پلاک فروشگاه', key: 'storePlate', width: 15 },
          { header: 'تاریخ (شمسی)', key: 'date', width: 15 },
          { header: 'ساعت ورود', key: 'checkIn', width: 10 },
          { header: 'ساعت خروج', key: 'checkOut', width: 10 },
        ];
        
        visits.forEach((v) => {
          const jalaaliDate = require('jalaali-js').toJalaali(new Date(v.date));
          const formattedDate = `${jalaaliDate.jy}/${jalaaliDate.jm}/${jalaaliDate.jd}`;
        
          worksheet.addRow({
            name: v.createdBy?.name || 'نامشخص',
            storePlate: v.storePlate,
            date: formattedDate,
            checkIn: v.checkIn,   // ✅ درست
            checkOut: v.checkOut, // ✅ درست
          });
        });
        
        
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=store_visits.xlsx');
  
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      res.status(500).json({ message: 'خطا در ایجاد فایل اکسل', error: err.message });
    }
  });


module.exports = router;
