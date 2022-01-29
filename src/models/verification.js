const { Schema, Types, model } = require("mongoose");

const verificationSchema = new Schema({
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

const Verification = model("Verification", verificationSchema);


module.exports = Verification;