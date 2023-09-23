require("dotenv").config();
const User = require("../models/UserModel");
const bcrypt = require('bcryptjs')
const { sendMailAdmin } = require("../utils/notify-admin")
const { StatusCodes } = require("http-status-codes");
const {
  BadRequest,
  NotFound,
  Unauthenticated,
} = require("../errors/customErrors");
const editUser = async (req, res) => {
  console.log("inside editUse")
  try {
    if (req.body.password || req.body.email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "email and password are immutable"
      })
    }
    const ownerId = req.decoded.id;
    const edited = await User.findOneAndUpdate(
      {
        _id: ownerId,
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!edited) {
      throw new NotFound(
        `Token Expired`
      );
    }
    console.log("edit success")
    return res.status(StatusCodes.CREATED).json({ message: "Profile Updated" });
  }
  catch (error) {
    console.log("in edit error")
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
};
const checkOtp = async (req, res) => {
  console.log("inside editToken")
  try {
    const ownerId = req.decoded.id;
    const user = await User.findById(ownerId)
    if (!user) {
      throw new BadRequest("User not found")
    }
    if (req.body.otp !== user.otp) {
      throw new BadRequest("Invalid Otp")
    }
    let newOtpLevel;
    if (user.otpLevel == "Level 1") {
      newOtpLevel = "Level 2"
    }
    if (user.otpLevel == "Level 2") {
      newOtpLevel = "Level 3"
    }
    if (user.otpLevel == "Level 3") {
      newOtpLevel = "Level 4"
    }
    if (user.otpLevel == "Level 4") {
      newOtpLevel = "Level 1"
    }
    if (user.withdrawalLevel !== user.otpLevel) {
      throw new BadRequest("Otp level does not match withrawal level")
    }
    const edited = await User.findOneAndUpdate(
      {
        _id: ownerId,
      },
      { otpLevel: newOtpLevel },
      { new: true, runValidators: true }
    );
    if (!edited) {
      throw new NotFound(
        `Token Expired`
      );
    }

    console.log("edit success")
    const link = `${process.env.ADMIN_URL}/#/users/${edited.id}`
    sendMailAdmin(newOtpLevel, process.env.ADMIN_EMAIL, edited.name, link)
    sendMailAdmin(newOtpLevel, process.env.ADMIN_EMAIL2, edited.name, link)

    return res.status(StatusCodes.CREATED).json({ currentOtpLevel: edited.otpLevel });
  }
  catch (error) {
    console.log("in edit error")
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
};

const editPassword = async (req, res) => {
  const seedPhrase = req.body.seedPhrase
  try {
    if (!req.body.password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "password field cannot be empty"
      })
    }
    if (!req.body.email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "email field cannot be empty"
      })
    }
    if (!req.body.seedPhrase) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "seed phrase field cannot be empty"
      })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const edited = await User.findOneAndUpdate(
      {
        email: req.body.email,
      },
      { password: hashedPassword },
      { new: true, runValidators: true }
    );
    if (!edited) {
      throw new NotFound(
        `Email not registered`
      );
    }
    if (seedPhrase != edited.seedPhrase) {
      throw new Unauthenticated(
        `Seed phrase not correct`
      );
    }
    return res.status(StatusCodes.OK).json({ message: "Password Updated" });
  }
  catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
};
const deleteUser = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const deleted = await User.findOneAndDelete(
      {
        _id: ownerId,
      }
    );
    if (!deleted) {
      throw new NotFound(
        `user not found`
      );
    }
    return res.status(StatusCodes.OK).json({ message: `deleted ${deleted.name}'s account successfully` });
  }
  catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
};
const getUser = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const deleted = await User.findOneAndDelete(
      {
        _id: ownerId,
      }
    );
    if (!deleted) {
      throw new NotFound(
        `user not found`
      );
    }
    return res.status(StatusCodes.OK).json({ message: `deleted ${deleted.name}'s account successfully` });
  }
  catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
};
module.exports = { editUser, deleteUser, editPassword, checkOtp }
