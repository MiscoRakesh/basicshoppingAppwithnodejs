const Product = require("../models/productModel");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const slug = require("slugify");
const validateId = require("../utils/validateMongodbId");
const clouduploadimg = require("../utils/cloudinary");
const fs = require("fs");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req?.body?.title) {
      req.body.slug = slug(req?.body?.title);
    }
    const product = await Product.create(req.body);
    res.json({ product });
  } catch (error) {
    throw new Error(error);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.json({ product });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find();
    res.json({ product });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req?.body?.title) {
      req.body.slug = slug(req?.body?.title);
    }
    const product = await Product.findByIdAndUpdate({ id }, req.body, {
      new: true,
    });
    res.json({ product });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    res.json({
      message: "Product deleted ",
      product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req?.user;
  const { prodId } = req?.body;

  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req?.user;
  const { star, prodId, comment } = req?.body;
  try {
    const product = await Product.findById(prodId);
    // console.log("RATING ",product)
    const alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
      // res.json(updateRating);
    } else {
      const ratedProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
      // res.json(ratedProduct);
    }
    const getallrating = await Product.findById(prodId);
    let totalrating = getallrating.ratings.length;
    let ratingsum = getallrating.ratings
      .map((e) => e.star)
      .reduce((prev, curr) => {
        prev + curr, 0;
      });
    let actualrating = Math.round(ratingsum / totalrating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualrating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  // console.log("in prod",req.files)
  try {
    const uploader = (path) => clouduploadimg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      console.log("in prod",file)
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(newpath);
    }
    const finalProduct = await Product.findByIdAndUpdate(
      id,
      { images: urls.map((i) => i) },
      {
        new: true,
      }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
};
