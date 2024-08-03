const express = require("express");
const {
  loginUserCtrl,
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getUserCart,
  userCart,
  deleteUserCart,
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Register Route
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/forgot-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.get("/all-users", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);
router.put("/:id", authMiddleware, isAdmin, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);
router.get("/cart", authMiddleware, getUserCart);
router.get("/up-cart", authMiddleware, userCart);
router.get("/empty-cart", authMiddleware, deleteUserCart);

module.exports = router;
