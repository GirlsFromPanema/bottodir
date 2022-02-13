const { Schema, Types, model } = require("mongoose");

const scamSchema = new Schema({
    id:
    {
        type: String
    },
}, { timestamps: true });

const AntiScam = model("antiscam", scamSchema);


module.exports = AntiScam;