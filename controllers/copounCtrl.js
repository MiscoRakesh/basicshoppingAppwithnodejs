const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, expiry, discount } = req.body;
  try {
    const coupon = await Coupon.create(req.body);
    if (!coupon) throw new Error(`Something went wrong`);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.find();
    if (!coupon) throw new Error(`Something went wrong`);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateCoupon) throw new Error(`Something went wrong`);
    res.json(updateCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    if (!deleteCoupon) throw new Error(`Something went wrong`);
    res.json({
      message: `Copuon Deleted`,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon };
