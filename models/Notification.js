const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const NotificationSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: [true, "please provide Notification date"],
        },
        id: {
            type: String,
            required: [true, "Notification id cannot be empty"]
        },
        title: {
            type: String,
            required: [true, 'Please provide notification title']
        },
        body: {
            type: String,
            required: [true, 'Please provide notification body']
        },
        read: {
            type: Boolean,
            default: false,
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
// NotificationSchema.plugin(AutoIncrement,{inc_field:'id'})
module.exports = mongoose.model("Notifications", NotificationSchema);
