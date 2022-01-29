const { Schema, Types, model } = require("mongoose");

const logSchema = new Schema({
    id:
    {
        type: String,
        unique: true,
        required: true
    },
    role:
    {
        type: String,
        required: false
    },
    channel:
    {
        type: String,
        required: true
    },
}, { timestamps: true });

const Log = model("Log", logSchema);


module.exports = Log;