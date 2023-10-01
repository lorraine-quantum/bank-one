const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name cannot be empty"],
    minlength: 3,
    maxlength: 20,
  },
  phoneNumber: {
    type: Number,
  },
  gender: {
    type: String,
    default: "Unspecified"
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  plan: {
    type: String,
    enum: ["basic", "starter", "premium", "master", "pro"],
    default: "basic",
  },
  accountType: {
    type: String,
  },
  accountNumber: {
    type: String,
  },

  tier: {
    type: String,
    default: "Tier 1"
  },

  userCanWithdrawPaypal: {
    type: Boolean,
    default: false,
  },
  userCanWithdrawSkrill: {
    type: Boolean,
    default: false,
  },
  withdrawalCharges: {
    type: Number,
    default: 15
  },
  bitcoinAddress: {
    type: String,
    default: "0"
  },
  usdtAddress: {
    type: String,
    default: "0"
  },
  dogeAddress: {
    type: String,
    default: "0"
  },
  ethereumAddress: {
    type: String,
    default: "0"
  },
  notification: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String
  },
  email: {
    type: String,
    required: [true, "email cannot be empty"],
    unique: [true, "email already registered"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  password: {
    type: String,
    required: [true, "password cannot be empty"],
    minlength: 6,
  },
  canResetPassword: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    default: "Update your Address",
    minlength: 6,
  },

  zipCode: {
    type: Number,
    minlength: 6,
  },
  country: {
    type: String,
  },
  region: {
    type: String,
  },
  seedPhrase: {
    type: String,
    default: "point-believe-twenty-open-rail-pool"
  },
  totalProfit: {
    type: Number,
    default: 0,
  },
  otp: {
    type: String,
    default: "0000"
  },
  withdrawalLevel: {
    type: String,
    default: "Level 1",
    enum: ['Level 1', 'Level 2', 'Level 3', 'Level 4']
  },
  otpLevel: {
    type: String,
    default: "Level 1",
    enum: ['Level 1', 'Level 2', 'Level 3', 'Level 4']
  },
  totalDeposit: {
    type: Number,
    default: 0,
  },
  pendBalance: {
    type: Number,
    default: 0,
  },
  totalBalance: {
    type: Number,
    default: 0,
  },
  referralBonus: {
    type: Number,
    default: 0,
  },
  totalEquity: {
    type: Number,
    default: 0,
  },
  tradingProgress: {
    type: Number,
    default: 0,
  },
},
  { timestamps: true });
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.generateJWT = function (signature) {
  return jwt.sign({ id: this._id, name: this.name }, signature);
};
UserSchema.methods.comparePassword = async function (passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};
UserSchema.plugin(AutoIncrement, { inc_field: 'id' })
module.exports = mongoose.model("user", UserSchema);
