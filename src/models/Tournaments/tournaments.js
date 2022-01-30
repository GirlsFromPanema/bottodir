const { Schema, Types, model } = require("mongoose");

const tournamentSchema = new Schema({
    id:
    {
        type: String,
        unique: true,
        required: true
    },
    name:
    {
        type: String,
        unique: true,
        required: true
    },
    date: { 
        type: String, 
        required: true 
    },

}, { timestamps: true });

const Tournament = model("Tournament", tournamentSchema);

module.exports = Tournament;