const express = require('express');
const router = express.Router();
const multer = require('multer');
const Unit = require('../models/Unit');
const fs = require('fs').promises; // For file cleanup
const mongoose = require('mongoose'); // For ObjectId validation

// Multer setup
const upload = multer({ dest: 'uploads/' });

const cpUpload = upload.fields([
  { name: 'license_file' },
  { name: 'fire_insurance_file' },
  { name: 'liability_insurance_file' },
  { name: 'uniform_image' },
  { name: 'id_card_image' },
  { name: 'shop_bag_image' },
]);

// POST: Create a new unit
router.post('/', cpUpload, async (req, res) => {
  try {
    // Validate personnel arrays
    const personnelCount = req.body.personnel_name?.length || 0;
    if (
      personnelCount !== (req.body.personnel_phone?.length || 0) ||
      personnelCount !== (req.body.personnel_national_code?.length || 0)
    ) {
      return res.status(400).json({ error: 'داده‌های پرسنل نامعتبر است' });
    }

    const formData = {
      ...req.body,
      personnel: req.body.personnel_name?.map((_, i) => ({
        name: req.body.personnel_name[i],
        phone: req.body.personnel_phone[i],
        nationalCode: req.body.personnel_national_code[i],
      })) || [],
      files: {
        license: req.files?.license_file?.[0]?.path || null,
        fireInsurance: req.files?.fire_insurance_file?.[0]?.path || null,
        liability: req.files?.liability_insurance_file?.[0]?.path || null,
        uniform: req.files?.uniform_image?.[0]?.path || null,
        idCard: req.files?.id_card_image?.[0]?.path || null,
        shopBag: req.files?.shop_bag_image?.[0]?.path || null,
      },
    };

    const unit = new Unit(formData);
    await unit.save();

    res.status(201).json({ message: 'فرم با موفقیت ذخیره شد', unitId: unit._id });
  } catch (err) {
    console.error('Error saving unit:', err);

    // Clean up uploaded files on error
    const files = [
      req.files?.license_file?.[0]?.path,
      req.files?.fire_insurance_file?.[0]?.path,
      req.files?.liability_insurance_file?.[0]?.path,
      req.files?.uniform_image?.[0]?.path,
      req.files?.id_card_image?.[0]?.path,
      req.files?.shop_bag_image?.[0]?.path,
    ].filter(Boolean);

    for (const file of files) {
      try {
        await fs.unlink(file);
      } catch (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    }

    res.status(500).json({ error: 'خطا در ذخیره فرم', details: err.message });
  }
});

// GET: Retrieve all units
router.get('/unit/get', async (req, res) => {
  try {
    const units = await Unit.find().select('-__v'); // Exclude __v field
    res.status(200).json({ units, count: units.length });
  } catch (err) {
    console.error('Error fetching units:', err);
    res.status(500).json({ error: 'خطا در دریافت واحدها', details: err.message });
  }
});

// GET: Retrieve a single unit by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'شناسه نامعتبر است' });
    }

    const unit = await Unit.findById(id).select('-__v');
    if (!unit) {
      return res.status(404).json({ error: 'واحد یافت نشد' });
    }

    res.status(200).json({ unit });
  } catch (err) {
    console.error('Error fetching unit:', err);
    res.status(500).json({ error: 'خطا در دریافت واحد', details: err.message });
  }
});

module.exports = router;