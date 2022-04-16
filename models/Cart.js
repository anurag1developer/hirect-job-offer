const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const cartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    products: [
      {
        ownerid: { type: String, required: true, trim: true },
        shopname: { type: String, required: true, trim: true },
        code: { type: String, required: true, trim: true },
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Cart", cartSchema);
