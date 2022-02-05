const { Schema, Types, model } = require("mongoose");

const chatSchema = new Schema({
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

const Chatbot = model("Chatbot", chatSchema);

module.exports = Chatbot;