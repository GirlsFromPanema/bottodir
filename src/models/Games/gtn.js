const { Schema, Types, model } = require("mongoose");

const gtnSchema = new Schema({
    id:
    {
        type: String,
        unique: true,
        required: true
    },
    channel:
    {
        type: String,
        unique: true,
        required: true
    },
   number: {
       type: Number,
       required: true
   }

}, { timestamps: true });

const Guessnumber = model("Games", gtnSchema);

module.exports = Guessnumber;