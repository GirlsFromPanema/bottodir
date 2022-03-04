const { Schema, Types, model } = require("mongoose");

const userSchema = new Schema({
    userId: {
        type: String
    },
    guildId: {
        type: String
    },
    moderatorId: {
        type: String
    },
    reason: {
        type: String
    },
    timestamp: {
        type: Number
    },
}, { timestamps: true });
   
const User = model("User", userSchema);

module.exports = User;