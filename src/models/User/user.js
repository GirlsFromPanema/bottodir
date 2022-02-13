const { Schema, Types, model } = require("mongoose");

const userSchema = new Schema({
    userId: String,
    guildId: String,
    moderatorId: String,
    reason: String,
    timestamp: Number,
})
   
const User = model("User", userSchema);

module.exports = User;