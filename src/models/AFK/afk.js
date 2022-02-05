const { Schema, Types, model } = require("mongoose");

const afkSchema = new Schema({
    userID:
    {
        type: String,
        unique: true,
        required: true
    },
    reason: { 
        type: String, 
        required: true, 
        default: false 
    },
    Date: {
        type: String,
        required: true
    },
    Guild: {
        type: String,
        unique: true,
        required: true

    }
}, { timestamps: true });

const Afk = model("Afk", afkSchema);


module.exports = Afk;