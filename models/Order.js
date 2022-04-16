const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true, trim: true },
    address: { type: Object, required: true, trim: true },
    status: { type: String, default: "pending", trim: true },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
