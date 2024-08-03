const generateToken = require("../config/jwtToken");
const User = require("../models/userModels");
const Cart = require("../models/cardModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const validateId = require("../utils/validateMongodbId");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendMail = require("./emailCtrl");
const crypto = require("crypto");
const { use } = require("../routes/authRoute");
const Coupon = require("../models/couponModel");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  // if user not found
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.status(200).send({
      sucess: true,
      newUser,
    });
  } else {
    throw new Error(`user already exists`);
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //   console.log(email, password);
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatch(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser?.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refershToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      Mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error(" Invalid Credentials");
  }
});

//Handle Logout

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refershToken) throw new Error(`No Refresh Token In cookie`);
  const refreshToken = cookie?.refershToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(202); // Forbidden
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(202); // Forbidden
});

// Handle Refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log("cookies", cookie);
  if (!cookie?.refershToken)
    throw new Error(`No Refresh Token Found in Cookies`);
  const refreshToken = cookie?.refershToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(` No refresh token present in db`);
  jwt.verify(refreshToken, process.env.JWT_SECREAT, (err, decode) => {
    if (err || user.id !== decode?.id) {
      throw new Error(` Something went wrong in refresh token`);
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken: accessToken });
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    validateId(id);
    console.log("get single user", id);
    const user = await User.findById({ _id: id });
    if (user) {
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    // console.log(id);
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.json(`User Deleted sucessfully`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const id = req?.params?.id;
  validateId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        mobile: req?.body?.mobile,
        email: req?.body?.email,
      },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const id = req?.params?.id;
  validateId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: req?.body?.isBlocked,
      },
      {
        new: true,
      }
    );
    res.json(`User Blocked`);
  } catch (error) {
    throw new Error(error);
  }
});

const unBlockUser = asyncHandler(async (req, res) => {
  const id = req?.params?.id;
  validateId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: req?.body?.isBlocked,
      },
      {
        new: true,
      }
    );
    res.json(`User UnBlocked`);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const password = req.body.password;
  console.log("update password", password);
  validateId(id);
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const newPassword = await user.save();
    res.json(newPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.find({ email });
  if (!user)
    throw new Error(
      `No Valid User Found please try agin with correct credentials`
    );
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi Please use the following link to reset your password. This Link will expire in 10 in min. <a href="http://localhost:4000/api/user/password/${token}">Ckick Here</a>`;
    const data = {
      to: email,
      subject: `Password Reset Link`,
      text: `Hey User`,
      html: resetURL,
    };
    sendMail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpries: { $gt: Date.now() },
  });
  if (!user) throw new Error(`Token expired Please try again after sometime`);
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpries = undefined;
  await user.save();
  res.json(user);
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req?.body;
  const { _id } = req?.user;
  validateId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if already added product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findByIdAndUpdate(cart[i]._id)
        .select("Price")
        .exec();
      object.price = getPrice.price;
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUserCart = asyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { _id } = req?.user;
  const { coupon } = req?.body;
  validateId(_id);
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
      throw new Error(`Invalid Coupon`);
    }
    const user = await User.find({ _id });
    let { products, cartTotal } = await Cart.findOne({
      orderby: user._id,
    }).populate("products.product");
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderby: user._id },
      { totalAfterDiscount },
      { new: true }
    );
    res.json(totalAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
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
  applyCoupon,
};
