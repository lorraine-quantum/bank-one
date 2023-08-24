require("dotenv").config();
const User = require("../models/UserModel");
const Card = require("../models/Cards");
const { StatusCodes } = require("http-status-codes");
const { shuffle, seedArray } = require('../utils/seed-phrase')
const generator = require('generate-serial-number')
const serialNumber = generator.generate(1)
const { getRandom12DigitNumber } = require('../utils/card-number')
const { sendBrevoMail } = require('../utils/mail')
const { sendMail } = require('../utils/nodemailer')
const jwt = require('jsonwebtoken')
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


    const link = `${process.env.SERVER_URL}/auth/verify-mail/${token}`
    // //send Email with brevo
    // const mailStatus = await sendBrevoMail(req.body.email, req.body.name, link)
    // console.log(mailStatus)
    // //If mail sending failed delete user from database
    // if (mailStatus != 201) {
    //   await User.findOneAndDelete({ email: req.body.email })
    //   throw new InternalServerError("Something went wrong while trying to send verification email, try again later")
    // }

    //send email with nodemailer
    const mailStatus = await sendMail(req.body.email, req.body.name, link)
    if (!mailStatus) {
      throw new InternalServerError("Something went wrong while trying to send verification email")
    }


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


//After registration an email is sent.
//clicking on the link runs this logic
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.signature
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOneAndUpdate({ _id: payload.id }, { verified: true })

    res.status(StatusCodes.PERMANENT_REDIRECT)
      .redirect(`${process.env.CLIENT_URL}/email-verified`)
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message })
  }
}



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
    if (!user.verified) {
      throw new Unauthenticated("Verify your email")
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
        tier: user.tier,
        otp: user.otp,
        otpMessage: user.otpMessage,
        profit: user.totalProfit,
        totalBalance: user.totalEquity,
        investments: user.totalDeposit,
        usdtAddress: user.usdtAddress,
        dogeAddress: user.dogeAddress,
        bitcoinAddress: user.bitcoinAddress,
        ethereumAddress: user.ethereumAddress
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

const deleteUser = async (req, res) => {
  try {
    const email = req.params.email
    const user = await User.findOneAndDelete({ email })
    if (!user) {
      throw new NotFound(`${email} does not exist`)
    }
    res.status(StatusCodes.OK)
      .json({ message: `${email} removed` })
  } catch (error) {
    console.error(error)
    res.status(error.statusCode)
      .json({ error: error.message })
  }
}

module.exports = { register, login, verifyEmail, deleteUser };
