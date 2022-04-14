const User = require("../models/User");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const { twilloPhone, client } = require("../sendOtp");
const Otp = require("../models/Otp");

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
    // send through Twillo

    const otpG = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    client.messages
      .create({
        body: otpG,
        from: twilloPhone,
        to: "+91" + phone,
      })
      .then((message) => console.log(message.sid));

    // store otp to database and set expiration time
    const newOtp = new Otp({
      value: otpG,
      owner: userExist._id,
    });
    await newOtp.save();

    // and send otp to that
    // res.status(200).json({ newOtp: newOtp });
    res.redirect(200, `/otp/${userExist._id}`);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

const otpUser = async (req, res, next) => {
  // take otp from login user
  const loginId = req.params.userid;
  const foundOtpUser = await Otp.find({ owner: loginId });
  if (foundOtpUser.length === 0) {
    return res.status(400).send("No user found");
  }
  const otpTaken = req.body.otp;
  if (otpTaken === foundOtpUser[foundOtpUser.length - 1].value) {
    return res.status(200).send("You are logged in");
  }
  res.status(400).send("Invalid OTP!!!");
  // check otp typed
};

module.exports = { registerUser, loginUser, otpUser };
