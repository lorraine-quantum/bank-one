const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const DepositSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "please provide Deposit date"],
    },
    id: {
      type: String,
      required: [true, "Deposit id cannot be empty"]
    },
    type: {
      type: String,
      default: "deposit",
    },
    reference: {
      type: String,
      required: [true, "please provide reference"],
    },
    amount: {
      type: Number,
    },
    via: {
      type: String,
    },
    edited: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "failed", "approved"],
      default: "pending",

    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "please provide owner"],
    },
    imageUrl: {
      type: String
    },
    filterId: {
      type: Number,
      required: true,
    },
    filterName: {
      type: String,
      required: true,
    }

  },
  { timestamps: true },

);
// DepositSchema.plugin(AutoIncrement,{inc_field:'id'})
module.exports = mongoose.model("Deposits", DepositSchema);
