const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {
  createBrand,
  getBrandAll,
  getBrandById,
  deleteBrandById,
  updateBrand,
} = require("../controllers/brandCtrl");

router.post("/create", authMiddleware, isAdmin, createBrand);
router.get("/all", getBrandAll);
router.put("/update/:id", updateBrand);
router.get("/:id", getBrandById);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteBrandById);

module.exports = router;
