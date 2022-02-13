const { Schema, Types, model } = require("mongoose");

const leaveSchema = new Schema({
    id:
    {
        type: String,
        unique: true,
        required: true
    },
    channel:
    {
        type: String,
        required: true
    },
}, { timestamps: true });

const Leave = model("Leave", leaveSchema);


module.exports = Leave;