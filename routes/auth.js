const router = require("express").Router();
const {
  registerUser,
  loginUser,
  otpUser,
} = require("../controller/authController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/otp/:userid").post(otpUser);

module.exports = router;
