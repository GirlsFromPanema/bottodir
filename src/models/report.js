const { Schema, Types, model } = require("mongoose");

const reportSchema = new Schema({
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

const Report = model("report", reportSchema);


module.exports = Report;