const User = require("../models/User");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

const registerUser = async (req, res, next) => {
  try {
    const emailExist = await User.findOne({ email: req.body.email });
    const phoneExist = await User.findOne({ phone: req.body.phone });

    if (emailExist || phoneExist) {
      return res.status(400).send("Try again, Invalid username or email");
    }

    const phone = req.body.phone;
    var a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
      phone
    );
    if (!phone) return res.status(401).send("Not a valid phone number");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      address: req.body.address,
      pincode: req.body.pincode,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ user: user });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

const loginUser = async (req, res, next) => {
  try {
    if (req.body.password === undefined) {
      throw new Error("Password is not provided");
    } else if (req.body.phone === undefined) {
      throw new Error("Phone number isn't provided");
    }

    // take phone number
    const phone = req.body.phone;
    var a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
      phone
    );
    if (!phone) return res.status(401).send("Not a valid phone number");

    // check for mobile number to database
    const userExist = await User.findOne({ phone: phone });
    if (!userExist)
      return res.status(400).send("Invalid phone number or password");

    // check for password
    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      userExist.password
    );

    if (!isCorrectPassword) {
      return res.status(403).send("Invalid phone number or password");
    }

    // generate otp expiration time and OTP verified or used
    // send through fast2sms or twillo and many other services

    const otpG = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    res.json({ otp: otpG });
    // and send otp to that
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

const otpUser = (req, res, next) => {
  // take otp from login user
  const loginOtp = req.params.otpType;
  const typedOtp = req.body.otp;
  if (loginOtp !== typedOtp) {
    return res.status(403).send("invalid otp");
  }
  res.send("logged in");
  // check otp typed
};

module.exports = { registerUser, loginUser, otpUser };
