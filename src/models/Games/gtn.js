const { Schema, Types, model } = require("mongoose");

const gtnSchema = new Schema({
    id:
    {
        type: String,
    },
    channel:
    {
        type: String,
    },
   number: {
       type: Number,
   }

}, { timestamps: true });

const Guessnumber = model("gtn", gtnSchema);

module.exports = Guessnumber;