const { Schema, Types, model } = require("mongoose");

const welcomeSchema = new Schema({
    id:
    {
        type: String,
    },
    role:
    {
        type: String,
    },
    channel:
    {
        type: String,
    },
}, { timestamps: true });

const Welcome = model("Welcome", welcomeSchema);


module.exports = Welcome;