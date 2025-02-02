const express = require("express");
const path = require("path"); 
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { Server } = require("http");

const app = express();
require("./conn/conn");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use('/upload', express.static(path.join(__dirname, 'upload')));

const Book = require("./routes/book");
app.use("/api/v1", Book);

const Cart = require("./routes/cart");
app.use("/api/v1", Cart);

const swaggerOption = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documents',
            version: '1.0.0',
            description: 'A simple API',
        },
    },
    servers: [
        {
            url: 'http://localhost:1000',
        },
    ],
    apis: [
        __dirname + '/routes/book.js', 
        __dirname + '/routes/cart.js'   
    ],
};


const swaggerSpac =  swaggerJsdoc(swaggerOption);
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpac));

const PORT = process.env.PORT || 1000; 
app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});
