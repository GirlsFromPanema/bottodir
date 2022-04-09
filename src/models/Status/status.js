const { Schema, Types, model } = require("mongoose");

const statusSchema = new Schema({
    id:
    {
        type: String
    },
    role: {
        type: String
    },
    statusmessage: {
        type: String
    },
}, { timestamps: true });

const status = model("status", statusSchema);

module.exports = status;