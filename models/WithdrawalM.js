const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const WithdrawalSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: [true, "please provide transaction date"],
        },
        id: {
            type: String,
            required: [true, "transaction id cannot be empty"]
        },
        accountNumber: {
            type: String,
            required: [true, "please provide account number"],
        },
        reference: {
            type: String,
            required: [true, "please provide reference"],
        },
        bankName: {
            type: String,
            required: [true, "please provide bankname"],
        },
        address: {
            type: String,
            required: [true, "please provide address"],
        },
        email: {
            type: String,
            required: [true, "please provide email"],
        },
        transferType: {
            type: String,
            required: [true, "please provide transfer type"],
        },
        amount: {
            type: Number,
            required: [true, "please provide amount"],
        },
        edited: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: "withdrawal",
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
// WithdrawalSchema.plugin(AutoIncrement,{inc_field:'id'})
module.exports = mongoose.model("Withdrawals", WithdrawalSchema);
