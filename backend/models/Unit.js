// models/Unit.js
const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
  {
    unit_name: { type: String, required: true, trim: true },
    unit_number: { type: Number, required: true },
    area: { type: Number, required: true },
    landline: { type: String, required: true, trim: true },
    customer_contact: { type: String, required: true, trim: true },
    manager_name: { type: String, required: true, trim: true },
    manager_national_code: { type: String, required: true, trim: true },
    manager_phone: { type: String, required: true, trim: true },
    manager_emergency: { type: String, required: true, trim: true },
    manager_email: { type: String, required: true, trim: true, lowercase: true },
    internal_manager: { type: String, required: true, trim: true },
    internal_manager_national_code: { type: String, required: true, trim: true },
    internal_manager_phone: { type: String, required: true, trim: true },
    internal_manager_emergency: { type: String, required: true, trim: true },

    personnel: [
      {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        nationalCode: { type: String, required: true, trim: true },
      },
    ],

    has_license: { type: String, enum: ['yes', 'no', ''], default: '' },
    has_workshop: { type: String, enum: ['yes', 'no', ''], default: '' },
    workshop_code: { type: Number },
    has_fire_insurance: { type: String, enum: ['yes', 'no', ''], default: '' },
    fire_insurance_start: { type: Date },
    fire_insurance_end: { type: Date },
    has_liability_insurance: { type: String, enum: ['yes', 'no', ''], default: '' },
    liability_insurance_start: { type: Date },
    liability_insurance_end: { type: Date },
    extinguisher: { type: String, enum: ['has', 'none', ''], default: '' },
    extinguisher_expiry: { type: Date },
    first_aid: { type: String, enum: ['has', 'none', ''], default: '' },
    uniform: { type: String, enum: ['has', 'none', ''], default: '' },
    id_card: { type: String, enum: ['has', 'none', ''], default: '' },
    has_instagram: { type: String, enum: ['yes', 'no', ''], default: '' },
    instagram_url: { type: String, trim: true },
    has_website: { type: String, enum: ['yes', 'no', ''], default: '' },
    website_url: { type: String, trim: true },
    has_snappay: { type: String, enum: ['has', 'none', ''], default: '' },
    has_shop_bag: { type: String, enum: ['yes', 'no', ''], default: '' },
    has_loyalty: { type: String, enum: ['yes', 'no', ''], default: '' },
    loyalty_description: { type: String, trim: true },
    product_variety: { type: String, trim: true },
    packaging: { type: String, trim: true },
    delivery_method: { type: String, enum: ['snapp', 'post', 'other', ''], default: '' },
    has_internet: { type: String, enum: ['has', 'none', ''], default: '' },
    internet_start: { type: Date },
    internet_end: { type: Date },

    files: {
      license: { type: String, default: null },
      fireInsurance: { type: String, default: null },
      liability: { type: String, default: null },
      uniform: { type: String, default: null },
      idCard: { type: String, default: null },
      shopBag: { type: String, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Unit', unitSchema);