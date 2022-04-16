const Shop = require("../models/Shop");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

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
    const shop = await Shop.findOne({ id: shopid });
    // const shops = await Shop.find({ _id: mongoose.Types.ObjectId(shopid) });
    console.log(shop);
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
    res.status(200).json({ shop: shop });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const getGrocery = (req, res, next) => {};

module.exports = { createShop, createProduct, getGrocery, nearByShop };
