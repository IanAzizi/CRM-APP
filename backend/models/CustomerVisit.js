const mongoose = require('mongoose');

const customerVisitSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  time: Date,
  description: String,
  location: {
    type: String,
    enum: ['سینما', 'فروشگاه ها', 'هایپر استار', 'رستوران مارماریس', 'فود کورت', 'کافه ها']
  }
});

// ✅ اول مدل رو تعریف کن
const CustomerVisit = mongoose.model('CustomerVisit', customerVisitSchema);

// ✅ بعد export کن
module.exports = CustomerVisit;
