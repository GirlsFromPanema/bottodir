const { Schema, Types, model } = require("mongoose");

const guildblacklist = new Schema({
    id:
    {
        type: String,
    },
    active: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

const BGuild = model("BGuild", guildblacklist);

module.exports = BGuild;