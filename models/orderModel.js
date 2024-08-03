const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        colour: String,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "not processed",
      enum: [
        "cancelled",
        "processing",
        "dispatched",
        "delivered",
        "cash on delivery",
        "not processed",
      ],
    },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
