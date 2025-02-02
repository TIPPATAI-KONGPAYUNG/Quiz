const mongoose = require("mongoose");

const cart = new mongoose.Schema({
    bookid:{
        type:String,
        required:true
    },
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity:{
        type:Number,
        required:true
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("cart", cart);