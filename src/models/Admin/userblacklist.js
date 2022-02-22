const { Schema, Types, model } = require("mongoose");

const blacklistSchema = new Schema({
    userID:
    {
        type: String,
    },
    active: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

const BUser = model("BUser", blacklistSchema);


module.exports = BUser;