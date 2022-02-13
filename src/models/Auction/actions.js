const { Schema, Types, model } = require("mongoose");

const auctionSchema = new Schema({
    id:
    {
        type: String,
        unique: true,
    },
    message:
    {
        type: String
    },
    channel:
    {
        type: String,
    },
    description:
    {
        type: String
    },
    budget:
    {
        type: String
    },
    pin:
    {
        type: String
    }
}, { timestamps: true });

const Auction = model("Auction", auctionSchema);


module.exports = Auction;