/*

const { Schema, Types, model } = require("mongoose");

const userPremium = new Schema({
  id: 
  {
    type: String,
    required: true,
    unique: true
  },
  isPremium: 
  {
    type: Boolean,
    default: false
  },
  premium: 
  {
    redeemedBy: 
    {
      type: Array,
      default: null
    },

    redeemedAt: 
    {
      type: Number,
      default: null
    },

    expiresAt: {
      type: Number,
      default: null
    },

    plan: {
      type: String,
      default: null
    }
  }
})

const Premium = model("premiumUser", userPremium)

module.exports = Premium;


*/