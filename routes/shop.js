const router = require("express").Router();
const {
  createShop,
  nearByShop,
  createProduct,
  getGrocery,
} = require("../controller/shopController");

// user says buy me chips from this shop
router.route("/create").post(createShop);
router.route("/nearby").post(nearByShop);
router.route("/create-product").post(createProduct);
router.route("/:shopid/groceries").post(getGrocery);

module.exports = router;
