const express = require("express");
const Book = require("../models/book");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload"); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });

/**
 * @swagger
 * /api/v1/add-book:
 *   post:
 *     summary: Add a new book
 *     tags:
 *       - Books
 *     description: Add a new book with an optional image
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - price
 *               - desc
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               desc:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */

router.post("/add-book", upload.single("image"), async (req, res) => {
    try {
        const book = new Book({
            image: req.file ? req.file.filename : null,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
        });

        await book.save();
        res.status(200).json({ message: "Book added successfully", book });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/update-book:
 *   put:
 *     summary: Update book details
 *     tags:
 *       - Books
 *     description: Update an existing book's details, including optional image upload.
 *     parameters:
 *       - name: bookid
 *         in: header
 *         required: true
 *         description: The ID of the book to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               desc:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */

router.put("/update-book", upload.single("image"), async (req, res) => {
    try {
        const { bookid } = req.headers;
        const book = await Book.findById(bookid);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (req.file && book.image) {
            const oldImagePath = path.join(__dirname, "../upload", book.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        book.image = req.file ? req.file.filename : book.image;
        book.title = req.body.title;
        book.author = req.body.author;
        book.price = req.body.price;
        book.desc = req.body.desc;

        await book.save();
        res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/delete-book:
 *   delete:
 *     summary: Delete a book
 *     tags:
 *       - Books
 *     description: Delete a book from the database, including removing its image file if exists.
 *     parameters:
 *       - name: bookid
 *         in: header
 *         required: true
 *         description: The ID of the book to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       400:
 *         description: Book ID is required
 *       404:
 *         description: Book not found
 *       500:
 *         description: An error occurred
 */

router.delete("/delete-book", async (req, res) => {
    try {
        const bookid  = req.headers.bookid;
        const book = await Book.findById(bookid);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.image) {
            const imagePath = path.join(__dirname, "../upload", book.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Book.findByIdAndDelete(bookid);
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

/**
 * @swagger
 * /api/v1/get-all-books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     description: Retrieve a list of all books sorted by creation date (newest first)
 *     responses:
 *       200:
 *         description: A list of books
 *       500:
 *         description: Internal Server Error
 */

router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json({ status: "Success", data: books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

/**
 * @swagger
 * /api/v1/get-book-by-id/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags:
 *       - Books
 *     description: Retrieve a book's details using its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved book details
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ status: "Not Found", message: "Book not found" });
        }

        return res.json({
            status: "Success",
            data: book,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


const numberPerPage = 8; 

/**
 * @swagger
 * /api/v1/get-book/{page}:
 *   get:
 *     summary: Get a book by page
 *     tags:
 *       - Books
 *     description: Retrieve a book's using its PAGE.
 *     parameters:
 *       - name: page
 *         in: path
 *         required: true
 *         description: The PAGE of the book to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved book details
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get-book/:page", async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / numberPerPage);

        if (page > totalPages || page < 1) {
            return res.status(404).json({ message: 'Page not found' });
        }

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * numberPerPage)
            .limit(numberPerPage);

        res.json({
            status: "Success",
            data: books,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});


module.exports = router;
