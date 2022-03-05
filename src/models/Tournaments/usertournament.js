const { Schema, Types, model } = require("mongoose");

const userTournament = new Schema({
    userID:
    {
        type: String,
        unique: true,
    },
    pin: {
        type: String
    },
    
}, { timestamps: true });

const UserT = model("user-tournament", userTournament);

module.exports = UserT;