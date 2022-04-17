const router = require("express").Router();
const {
  createShop,
  nearByShop,
  createProduct,
  getGrocery,
  getProductByCategory,
} = require("../controller/shopController");

router.route("/create").post(createShop);
router.route("/nearby").post(nearByShop);
router.route("/create-product").post(createProduct);
router.route("/get-grocery").post(getGrocery);
router.route("/get-category-product").post(getProductByCategory);

module.exports = router;
