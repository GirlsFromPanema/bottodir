const { Schema, Types, model } = require("mongoose");

const scamSchema = new Schema({
    id:
    {
        type: String,
        unique: true,
        required: true
    },
    option:
    {
        type: String,
        required: true
    }
}, { timestamps: true });

const AntiScam = model("Antiscam", scamSchema);


module.exports = AntiScam;