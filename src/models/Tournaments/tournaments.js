const { Schema, Types, model } = require("mongoose");

const tournamentSchema = new Schema({
    id:
    {
        type: String,
        unique: true,
    },
    name:
    {
        type: String,
        unique: true,
    },
    date: { 
        type: String, 
    },
    price: {
        type: String,
    }

}, { timestamps: true });

const Tournament = model("Tournament", tournamentSchema);

module.exports = Tournament;