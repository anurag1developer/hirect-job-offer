const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

const registerUser = async (req, res, next) => {
  if (typeof req.body.name === "number") {
    // status code 406 gives -  not acceptable
    return res.status(406).send("Name can only by in alphabets");
  }
  if (typeof req.body.pincode === "string") {
    // status code 406 gives -  not acceptable
    return res.status(406).send("Pincode can only by in numbers format");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = {
    name: req.body.name,
    address: req.body.address,
    pincode: req.body.pincode,
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
  };
  res.json({ user: user });
};

const loginUser = (req, res, next) => {
  // take phone number
  const phone = req.body.phone;
  var a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
    phone
  );
  if (!phone) return res.status(401).send("Not a valid phone number");

  // check for mobile number to database

  // generate otp expiration time and OTP verified or used
  // send through fast2sms or twillo and many other services

  const otpG = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  // console.log(otpG);
  res.redirect(200, `/otp:${otpG}/type-otp`);
  // res.json({ otp: otp });
  // and send otp to that
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
