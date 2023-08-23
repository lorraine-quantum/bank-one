const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const LoanSchema = new mongoose.Schema(
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

        loanType: {
            type: String,
            required: [true, "please provide loan type"],
        },
        loanDuration: {
            type: String,
            required: [true, "please provide duration"],
        },
        loanAmount: {
            type: Number,
            required: [true, "please provide amount"],
        },
        edited: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: "loan",
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
// LoanSchema.plugin(AutoIncrement,{inc_field:'id'})
module.exports = mongoose.model("Loans", LoanSchema);
