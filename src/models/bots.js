const { Schema, Types, model } = require("mongoose");

const botSchema = new Schema({
    id:
    {
        type: String,
        unique: true,
        required: true
    },
    guilds: [{
        type: Types.ObjectId,
        ref: "Guild",
        required: true,
    }]
}, { timestamps: true });

const Bot = model("Bot", botSchema);


module.exports = Bot;