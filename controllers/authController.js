require("dotenv").config();
const User = require("../models/UserModel");
const Card = require("../models/Cards");
const { StatusCodes } = require("http-status-codes");
const { shuffle, seedArray } = require('../utils/seed-phrase')
const generator = require('generate-serial-number')
const serialNumber = generator.generate(1)
const { getRandom12DigitNumber } = require('../utils/card-number')

const {
  BadRequest,
  NotFound,
  Unauthenticated,
} = require("../errors/customErrors");
const register = async (req, res) => {
  try {
    shuffle(seedArray)
    let slicedArray = seedArray.slice(0, 6)
    let seedPhrase = slicedArray.join("-")
    req.body.seedPhrase = seedPhrase
    req.body.id = serialNumber
    const accountNumber = getRandom12DigitNumber().substring(2, 12)
    req.body.accountNumber = accountNumber
    const newUser = await User.create(req.body);
    const token = newUser.generateJWT(process.env.JWT_SECRET);
    res
      .status(StatusCodes.CREATED)
      .json(
        {
          token,
          owner: newUser.name,
          email: newUser.email,
          accountType: newUser.accountType,
          phoneNumber: newUser.phoneNumber,
          accountNumber: newUser.accountNumber,
          tier: newUser.tier
        });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email already registered, Sign In" });
      return;
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(StatusCodes.BAD_REQUEST, error.message);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequest("email and password cannot be empty");
    }
    const user = await User.findOne({ email: email });
    if (!user) {

      throw new NotFound("Email not registered, Sign up");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Unauthenticated("Invalid credentials");
    }
    const token = user.generateJWT(process.env.JWT_SECRET);
    res.status(StatusCodes.OK).json(
      {
        token: token,
        owner: user.name,
        email: user.email,
        accountType: user.accountType,
        phoneNumber: user.phoneNumber,
        accountNumber: user.accountNumber,
        tier: user.tier
      });
  } catch (error) {
    const { message, statusCode } = error;
    console.log(statusCode, message);
    if (statusCode) {
      res.status(statusCode).json({ message: message });
      console.log(statusCode, message);
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: message });
    console.log(message);
  }
};

module.exports = { register, login };
