const { Schema, Types, model } = require("mongoose");

const guildeconomySchema = new Schema({
    id:
    {
        type: String,
        required: true
    },
    option:
    {
        type: String,
        required: true
    },
}, { timestamps: true });

const GEconomy = model("guildeconomy", guildeconomySchema);


module.exports = GEconomy;