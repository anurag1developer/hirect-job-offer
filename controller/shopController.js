const Shop = require("../models/Shop");
const Category = require("../models/Category");
const Product = require("../models/Product");
// const mongoose = require("mongoose");

const { createHmac } = require("crypto");

const createShop = async (req, res, next) => {
  const generateCode = createHmac("sha256", process.env.SECRET)
    .update(process.env.UPDATE)
    .digest("hex");

  try {
    const newShop = new Shop({
      owner: req.body.owner,
      ownerPhone: req.body.ownerPhone,
      ownerid: req.body.owner.id,
      name: req.body.name,
      code: generateCode + req.body.name,
      address: req.body.address,
      pincode: req.body.pincode,
      products: req.body.products,
    });
    await newShop.save();
    res.json({ newShop: newShop });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const nearByShop = (req, res) => {
  const userid = req.body.userid;
  const location = req.body.locaton;
  const shops = Shop.find({});
};

const createProduct = async (req, res) => {
  try {
    const shopid = req.body.shopid;
    // console.log(shopid);
    const shop = await Shop.findOne({ _id: shopid });
    // const shops = await Shop.find({ _id: mongoose.Types.ObjectId(shopid) });
    // console.log(shop);
    if (!shopid) {
      return res
        .status(403)
        .send(
          "You need shopid, You can't create a product, you don't have a shop"
        );
    }

    const newProduct = new Product({
      title: req.body.title,
      desc: req.body.desc,
      img: req.body.img,
      categories: req.body.categories,
      price: req.body.price,
    });
    await newProduct.save();

    shop.products.push(newProduct._id);
    await shop.save();

    // Create a Category collection which have all the products
    for (let i = 0; i < req.body.categories.length; i++) {
      const existedCategory = await Category.findOne({
        name: req.body.categories[i],
      });
      if (existedCategory) {
        // console.log(existedCategory);
        existedCategory.products.push(newProduct._id);
        await existedCategory.save();
      } else {
        const newCategory = new Category({
          name: req.body.categories[i],
        });
        newCategory.products.push(newProduct._id);
        await newCategory.save();
      }
    }

    res.status(200).json({ shop: shop });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getGrocery = async (req, res, next) => {
  try {
    const shopid = req.body.shopid;
    const shop = await Shop.findById(shopid);
    const groceriesIds = shop.products;
    const promises = groceriesIds.map(async (groceryId) => {
      const grocery = await Product.findById(groceryId);
      return grocery;
    });
    const groceries = await Promise.all(promises);
    // console.log(groceries);
    // console.log(groceriesIds);
    res.status(200).json({ groceries: groceries });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.body.categoryId);
    const promises = category.products.map(async (productId) => {
      const product = await Product.findById(productId);
      return product;
    });
    const products = await Promise.all(promises);
    // console.log(products);
    res.status(200).json({ products: products });
  } catch (e) {
    res.status(200).json({ error: e.message });
  }
};

module.exports = {
  createShop,
  createProduct,
  getGrocery,
  nearByShop,
  getProductByCategory,
};
