const Brand = require("../models/brandModel");
const asynchandler = require("express-async-handler");
const validateId = require("../utils/validateMongodbId");

const createBrand = asynchandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getBrandById = asynchandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const brand = await Brand.findById(id);
    if (!brand) throw new Error(`not found`);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrandById = asynchandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) throw new Error(`Error in performing operation`);
    res.json({
      message: `Deleted sucessfuly`,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBrandAll = asynchandler(async (req, res) => {
  // const { id } = req.params;
  try {
    const brand = await Brand.find();
    if (!brand) throw new Error(`not found`);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asynchandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const brand = await Brand.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      {
        new: true,
      }
    );
    if (!brand) throw new Error(`not found`);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  getBrandById,
  deleteBrandById,
  getBrandAll,
  updateBrand,
};
