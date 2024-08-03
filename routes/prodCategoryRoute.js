const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {
  createCategory,
  getCategoryAll,
  getCategoryById,
  deleteCategoryById,
  updateCategory,
} = require("../controllers/prodCategoryCtrl");

router.post("/create", authMiddleware, isAdmin, createCategory);
router.get("/all", getCategoryAll);
router.put("/update/:id", updateCategory);
router.get("/:id", getCategoryById);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteCategoryById);

module.exports = router;
