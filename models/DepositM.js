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
      required: [true, "please provide amount"],
    },
    via: {
      type: String,
      required: [true, "Provide the means of deposit"]
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
