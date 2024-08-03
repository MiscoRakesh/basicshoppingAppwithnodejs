const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCoupon,
  getAllCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/copounCtrl");

router.post("/create-coupon", authMiddleware, isAdmin, createCoupon);
router.get("/all-coupon", authMiddleware, getAllCoupon);
router.put("/update-coupon/:id", authMiddleware, updateCoupon);
router.delete("/delete-coupon/:id", authMiddleware, deleteCoupon);

module.exports = router;
