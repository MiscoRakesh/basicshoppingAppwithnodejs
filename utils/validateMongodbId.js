const mongoose = require("mongoose");
const validateId = (id) => {
    console.log("in validate",id)
  const validId = mongoose.Types.ObjectId.isValid(id);
  if (!validId) throw new Error(`Not a valid Id`);
};
module.exports = validateId;
