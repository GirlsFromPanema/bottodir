const { Schema, Types, model } = require("mongoose");

const pollSchema = new Schema({
    id:
    {
        type: String,
        unique: true,
        required: true
    },
    channel:
    {
        type: String,
        unique: true,
        required: true
    },
}, { timestamps: true });

const Poll = model("Polls", pollSchema);

module.exports = Poll;