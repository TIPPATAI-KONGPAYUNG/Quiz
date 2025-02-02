const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Book = require("../models/book");

/**
 * @swagger
 * /api/v1/add-to-cart:
 *   post:
 *     summary: Add a book to cart
 *     tags:
 *       - Carts
 *     description: Add a book to the cart with optional image
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - bookid
 *               - quantity
 *             properties:
 *               bookid:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: The filename of the book image (optional)
 *                 example: "book-image.jpg"
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               desc:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book added to cart successfully
 *       400:
 *         description: Book ID or quantity is missing
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */

router.post("/add-to-cart", async (req, res) => {
    try {
        const { bookid, image, title, author, price, quantity } = req.body;

        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const book = await Book.findById(bookid);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const cart = new Cart({ bookid, image, title, author, price, quantity: quantity || 1 });
        await cart.save();

        res.status(200).json({ status: "Success", data: cart, message: "Book added to cart successfully" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/remove-from-cart{bookid}:
 *   delete:
 *     summary: Delete a book in cart
 *     tags:
 *       - Carts
 *     description: Delete a book from the database cart, including removing its image file if exists.
 *     parameters:
 *       - name: bookid
 *         in: path
 *         required: true
 *         description: The ID of the book to delete in cart
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal Server Error
 */

router.delete('/remove-from-cart/:bookid', async (req, res) => {
    const { bookid } = req.params;

    try {
        const result = await Cart.deleteOne({ bookid });
        if (result.deletedCount === 0) {
            return res.status(404).send('Item not found');
        }
        res.status(200).send('Item removed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * @swagger
 * /api/v1/remove-cart:
 *   delete:
 *     summary: Delete all books in cart
 *     tags:
 *       - Carts
 *     description: Delete all books
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       500:
 *         description: Internal Server Error
 */

router.delete('/remove-cart', async (req, res) => {
    try {
        const result = await Cart.deleteMany({});
        res.status(200).send('Cart cleared successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * @swagger
 * /api/v1/update-cart:
 *   put:
 *     summary: Update cart item
 *     tags:
 *       - Carts
 *     description: Update the quantity of a book in the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookid:
 *                 type: string
 *                 description: The ID of the book in the cart to update
 *               quantity:
 *                 type: number
 *                 description: The new quantity for the book in the cart
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *                   properties:
 *                     bookid:
 *                       type: string
 *                     quantity:
 *                       type: number
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */

router.put("/update-cart", async (req, res) => {
    try {
        const { bookid, quantity } = req.body;
        const cart = await Cart.findOne({ bookid });

        if (!cart) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        cart.quantity = quantity;
        await cart.save();

        res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/get-cart:
 *   get:
 *     summary: Get all books in cart
 *     tags:
 *       - Carts
 *     description: Retrieve a list of all books in cart
 *     responses:
 *       200:
 *         description: A list of books in cart
 *       500:
 *         description: Internal Server Error
 */

const DISCOUNTS = { 2: 0.10, 3: 0.20, 4: 0.30, 5: 0.40, 6: 0.50, 7: 0.60 };

const calculateTotal = async () => {
    const carts = await Cart.find();
    let totalBasePrice = 0;
    let totalDiscount = 0;
    let totalPrice = 0;
    let bookCount = {};

    carts.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            bookCount[item.title] = (bookCount[item.title] || 0) + 1;
        }
    });

    while (Object.values(bookCount).some(qty => qty > 0)) {
        let uniqueCount = Object.keys(bookCount).length;
        let basePrice = 0;
        carts.forEach(item => {
            if (bookCount[item.title] > 0) {
                basePrice += item.price;
            }
        });

        let discount = DISCOUNTS[uniqueCount] || 0;
        let discountAmount = basePrice * discount;

        totalBasePrice += basePrice;
        totalDiscount += discountAmount;
        totalPrice += basePrice - discountAmount;

        for (let title in bookCount) {
            if (bookCount[title] > 0) {
                bookCount[title]--;
                if (bookCount[title] === 0) {
                    delete bookCount[title];
                }
            }
        }
    }

    return { totalBasePrice, totalDiscount, totalPrice, discountPercent: (totalDiscount / totalBasePrice) * 100 };
};

/**
 * @swagger
 * /api/v1/get-cart:
 *   get:
 *     summary: Get all books in cart
 *     tags:
 *       - Carts
 *     description: Retrieve a list of all books in cart
 *     responses:
 *       200:
 *         description: A list of books in cart
 *       500:
 *         description: Internal Server Error
 */

router.get('/get-cart', async (req, res) => {
    try {
        const carts = await Cart.find();
        const totals = await calculateTotal();
        res.json({ status: "Success", data: carts, totals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
