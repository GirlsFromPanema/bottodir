const { Schema, Types, model } = require("mongoose");

const guildeconomySchema = new Schema({
    id:
    {
        type: String,
    },
}, { timestamps: true });

const GEconomy = model("guildeconomy", guildeconomySchema);


module.exports = GEconomy;