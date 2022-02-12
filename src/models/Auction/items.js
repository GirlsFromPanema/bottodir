const { Schema, Types, model } = require("mongoose");

const auctionitemSchema = new Schema({
    userID:
    {
        type: String,
        required: true
    },
    description:
    {
        type: String
    },
    budget:
    {
        type: Number
    },
    message: {
        type: String
    },
    pin:
    {
        type: String
    }
}, { timestamps: true });

const AuctionItems = model("Auctionitems", auctionitemSchema);


module.exports = AuctionItems;