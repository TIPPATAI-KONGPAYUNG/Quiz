require("dotenv").config();
const mongoose = require("mongoose");

const conn = async () => {
    try {
        if (!process.env.URL) {
            throw new Error("Database URL is not defined in .env");
        }
        await mongoose.connect(process.env.URL);
        console.log("Connected to database");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

conn();

