const mongoose = require('mongoose');

const storeVisitSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  storePlate: { type: String, required: true },
  date: { type: Date, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  closureReason: {
    type: String,
    enum: ['پلمپ', 'قطعی برق' , 'تغییردکوراسیون' , 'عدم اجازه از سوی مدیریت ' , ''],
    default: '',
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('StoreVisit', storeVisitSchema);
