const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  products: {
    type: Array,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
