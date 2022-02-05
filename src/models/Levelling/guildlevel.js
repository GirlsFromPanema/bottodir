const { Schema, Types, model } = require("mongoose");

const guildlevelSchema = new Schema({
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

const GLevel = model("guildlevel", guildlevelSchema);


module.exports = GLevel;