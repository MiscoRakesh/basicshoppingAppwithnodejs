const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("coupon", couponSchema);
