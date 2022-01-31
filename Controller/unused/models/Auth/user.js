const { Schema, Types, model } = require("mongoose");

const userAuthSchema = new Schema({
    userID: { 
        type: String, 
        unique: true,
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: null 
    },
    password: {
        type: String, 
        required: true,
        unique: true
        },
    recoveryID: { 
        type: Number, 
        required: true
    },
});

const AuthUser = model("signed-users", userAuthSchema);


module.exports = AuthUser;