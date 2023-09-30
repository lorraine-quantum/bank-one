const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const CardSchema = new mongoose.Schema(
    {
        expiryDate: {
            type: String,
            // required: [true, "please provide Card expiry"],
        },
        cardType: {
            type: String,
            required: [true, "Card type cannot be empty"],

        },
        id: {
            type: String,
            required: [true, "Card id cannot be empty"]
        },
        cardNumber: {
            type: String,
            required: [true, "please provide reference"],
        },
        status: {
            type: String,
            enum: ["pending", "failed", "approved"],
            default: "pending",
        },
        cardHolderName: {
            type: String,
            required: [true, "please provide name"],
        },
        cvcCode: {
            type: String,

        },
        signature: {
            type: String,
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

CardSchema.pre('save', function (next) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 3);
    // Format the date as MM/YY
    const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear().toString().slice(-2)}`;
    this.expiryDate = formattedDate;
    next();
});

// CardSchema.plugin(AutoIncrement,{inc_field:'id'})
module.exports = mongoose.model("Cards", CardSchema);
