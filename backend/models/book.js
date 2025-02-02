const mongoose = require("mongoose");

const book = new mongoose.Schema({
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
    desc: {
        type: String,
        default: "-",
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("book", book);