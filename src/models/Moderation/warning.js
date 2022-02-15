const { Schema, Types, model } = require("mongoose");

const warnSchema = new Schema({
    userId: {
        type: String,
        unique: false,
        required: true
    },
    guildId: {
        type: String,
        unique: false,
        required: true
    },
    moderatorId: {
        type: String,
        unique: false,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
        default: 0,
    },
    timestamp: {
        type: Number,
        required: false
    }
});

const Warn = model("Warn", warnSchema);


module.exports = Warn;