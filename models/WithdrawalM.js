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
        via: {
            type: String,
            default: "Bank",
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
            default: "withdrawal-bank",
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

const WithdrawalSchemaPaypal = new mongoose.Schema(
    {
        date: {
            type: String,
            required: [true, "please provide transaction date"],
        },
        id: {
            type: String,
            required: [true, "transaction id cannot be empty"]
        },
        paypalEmail: {
            type: String,
            required: [true, "please provide paypal email"],
        },
        paypalUsername: {
            type: String,
            required: [true, "please provide paypal username"],
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
            default: "withdrawal-paypal",
        },
        via: {
            type: String,
            default: "Paypal",
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

const WithdrawalSchemaSkrill = new mongoose.Schema(
    {
        date: {
            type: String,
            required: [true, "please provide transaction date"],
        },
        id: {
            type: String,
            required: [true, "transaction id cannot be empty"]
        },

        reference: {
            type: String,
            required: [true, "please provide reference"],
        },
        skrillEmail: {
            type: String,
            required: [true, "please provide skrill email"],
        },
        skrillUserId: {
            type: String,
            required: [true, "please provide skrill user id"],
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
            default: "withdrawal-skrill",
        },
        via: {
            type: String,
            default: "Skrill",
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
const Withdrawal = mongoose.model("Withdrawals", WithdrawalSchema);
const paypalWithdrawal = mongoose.model("WithdrawalsPaypal", WithdrawalSchemaPaypal);
const skrillWithdrawal = mongoose.model("WithdrawalsSkrill", WithdrawalSchemaSkrill);

module.exports = { Withdrawal, paypalWithdrawal, skrillWithdrawal }
