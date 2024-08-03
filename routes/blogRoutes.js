const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  likeTheBlog,
  disLikeTheBlog,
  uploadImages
} = require("../controllers/blogCtrl");
const {
  uploadPhoto,
  blogImgResize,
} = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/create-blog", createBlog);
router.put("/update-blog/:id", updateBlog);
router.get("/", getAllBlog);
router.get("/:id", getBlog);
router.put("/:id", authMiddleware, likeTheBlog);
router.put("/dislike/:id", authMiddleware, disLikeTheBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
);

module.exports = router;
