const Blog = require("../models/blogModels");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const validateId = require("../utils/validateMongodbId");
const clouduploadimg = require("../utils/cloudinary");
const fs = require("fs")

const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = req.body;
    console.log(blog);
    const newBlog = await Blog.create(blog);
    if (newBlog) res.json(newBlog);
    else {
      throw new Error(`Somethinh Went wrong`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = req.body;
    const newBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (newBlog) res.json(newBlog);
    else {
      throw new Error(`Somethinh Went wrong`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const newBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numView: 1 },
      },
      { new: true }
    );
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.find();
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const likeTheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  // Blog which is to be Liked
  const blog = await Blog.findById(blogId);
  // finding userId
  const loginUserId = req?.user?._id;
  //   console.log("Blog======>", loginUserId);
  const isLiked = blog?.isLiked;
  // user already dislike the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const disLikeTheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  // Blog which is to be Liked
  const blog = await Blog.findById(blogId);
  // finding userId
  const loginUserId = req?.user?._id;
  //   console.log("Blog======>", loginUserId);
  const isDisLiked = blog?.isDisliked;
  // user already dislike the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
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
      fs.unlinkSync(newpath)
    }
    const finalBlog = await Blog.findByIdAndUpdate(
      id,
      { images: urls.map((i) => i) },
      {
        new: true,
      }
    );
    res.json(finalBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  likeTheBlog,
  disLikeTheBlog,
  uploadImages
};
