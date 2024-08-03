const Blog = require("../models/blogCategoryModel");
const asynchandler = require("express-async-handler");
const validateId = require("../utils/validateMongodbId");

const createCategory = asynchandler(async (req, res) => {
    try {
      const category = await Blog.create(req.body);
      res.json(category);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const getCategoryById = asynchandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    try {
      const category = await Blog.findById(id);
      if (!category) throw new Error(`not found`);
      res.json(category);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const deleteCategoryById = asynchandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    try {
      const category = await Blog.findByIdAndDelete(id);
      if (!category) throw new Error(`Error in performing operation`);
      res.json({
        message: `Deleted sucessfuly`,
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const getCategoryAll = asynchandler(async (req, res) => {
    // const { id } = req.params;
    try {
      const category = await Blog.find();
      if (!category) throw new Error(`not found`);
      res.json(category);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const updateCategory = asynchandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    try {
      const category = await Blog.findByIdAndUpdate(
        id,
        {
          title: req?.body?.title,
        },
        {
          new: true,
        }
      );
      if (!category) throw new Error(`not found`);
      res.json(category);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  module.exports = {
    createCategory,
    getCategoryById,
    deleteCategoryById,
    getCategoryAll,
    updateCategory
  };
  