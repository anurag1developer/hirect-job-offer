const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    img: { type: String, required: true, trim: true },
    categories: { type: Array },
    price: { type: Number, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
