const { Schema, Types, model } = require("mongoose");

const blacklistSchema = new Schema({
    userID:
    {
        type: String,
        unique: true,
        required: true
    },
    active: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
}, { timestamps: true });

const BUser = model("BUser", blacklistSchema);


module.exports = BUser;