import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';

const Cart = () => {
    const [cartData, setCartData] = useState(null);
    const [Total, setTotal] = useState(0);
    const [Discont, setDiscont] = useState(0);
    const [DiscontPrice, setDiscontPrice] = useState(0);
    const [Price, setPrice] = useState(0);

    const increase = async (bookid, quantity) => {
        const newQuantity = quantity + 1;
        try {
            await axios.put('http://localhost:1000/api/v1/update-cart', { bookid, quantity: newQuantity });
            setCartData(prevData => prevData.map(item =>
                item.bookid === bookid ? { ...item, quantity: newQuantity } : item
            ));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };
//test
    const decrease = async (bookid, quantity) => {
        if (quantity <= 1) return;
        const newQuantity = quantity - 1;
        try {
            await axios.put('http://localhost:1000/api/v1/update-cart', { bookid, quantity: newQuantity });
            setCartData(prevData => prevData.map(item =>
                item.bookid === bookid ? { ...item, quantity: newQuantity } : item
            ));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const deleteItem = async (bookid) => {
        try {
            await axios.delete(`http://localhost:1000/api/v1/remove-from-cart/${bookid}`);
            setCartData(prevData => prevData.filter(item => item.bookid !== bookid));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const deleteCart = async () => {
        try {
            await axios.delete(`http://localhost:1000/api/v1/remove-cart`);
            setCartData([]);
            setTotal(0);
            setDiscont(0);
            setDiscontPrice(0);
            setPrice(0);
        } catch (error) {
            console.error('Error deleting cart:', error);
        }
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get("http://localhost:1000/api/v1/get-cart");
                setCartData(response.data.data);

                const totals = response.data.totals;
                setTotal(totals.totalBasePrice);
                setDiscontPrice(totals.totalDiscount);
                setPrice(totals.totalPrice);
                setDiscont(totals.discountPercent);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };
        fetchCart();
    }, []);

    return (
        <div className='bg-zinc-900 min-h-screen h-auto px-12'>
            {!cartData && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <Loader />
                </div>
            )}

            {cartData && cartData.length === 0 && (
                <div className="h-screen flex items-center justify-center flex-col">
                    <h1 className="text-5xl lg:text-6xl font-semibold text-yellow-100">
                        Empty Cart
                    </h1>
                </div>
            )}

            {cartData && cartData.length > 0 && (
                <>
                    <h1 className="text-5xl font-semibold text-yellow-100 mb-4 py-4 text-center lg:text-6xl">
                        Your Cart
                    </h1>
                    {cartData.map((items) => (
                        <div className='w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center' key={items._id}>
                            <img
                                src={`http://localhost:1000/upload/${items.image}`}
                                alt="/"
                                className='h-[20vh] md:h-[10vh] object-cover mr-4'
                            />
                            <div className='w-full md:w:auto'>
                                <h1 className='text-2xl text-zinc-100 font-semibold text-start mt-2 md:mt-0'>
                                    {items.title}
                                </h1>
                                <p className='text-normal text-zinc-300 mt-2 hidden lg:block'>
                                    {items.author}
                                </p>
                                <h2 className='text-zinc-100 text-xl font-semibold text-right'>
                                    <span className="mr-1">{items.price}</span><span>THB</span>
                                </h2>
                            </div>

                            <div className='my-4 ml-10 flex flex-row items-center gap-4'>
                                <button
                                    onClick={() => increase(items.bookid, items.quantity)}
                                    className="px-4 py-2 border border-green-400 text-green-400 rounded hover:bg-green-500 hover:text-white w-12"
                                >
                                    +
                                </button>

                                <p className="text-zinc-300 text-lg font-semibold">{items.quantity}</p>

                                <button
                                    onClick={() => decrease(items.bookid, items.quantity)}
                                    className="px-4 py-2 border border-red-400 text-red-400 rounded hover:bg-red-500 hover:text-white w-12"
                                >
                                    -
                                </button>

                                <button
                                    onClick={() => deleteItem(items.bookid)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className='w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center'>
                        <div className='w-full md:w:auto'>
                            <h1 className='text-2xl text-zinc-100 font-semibold text-start mt-2 md:mt-0'>
                                Total
                            </h1>
                            <div className='flex flex-row justify-between mt-4'>
                                <h1 className='text-zinc-100 text-xl'>Price Total:</h1>
                                <h2 className='text-zinc-100 text-xl font-semibold'>{Total} THB</h2>
                            </div>

                            <div className='flex flex-row justify-between mt-4'>
                                <h1 className='text-zinc-100 text-xl'>Discount:</h1>
                                <h2 className='text-zinc-100 text-xl font-semibold'>{Discont.toPrecision(3)}%</h2>
                            </div>

                            <div className='flex flex-row justify-between mt-4'>
                                <h1 className='text-zinc-100 text-xl'>Discount Price:</h1>
                                <h2 className='text-red-500 text-xl font-semibold'>{DiscontPrice} THB</h2>
                            </div>

                            <div className='flex flex-row justify-between mt-4'>
                                <h1 className='text-zinc-100 text-xl'>Price:</h1>
                                <h2 className='text-red-100 text-3xl font-semibold'>{Price} THB</h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center pb-4 md:justify-end mt-4">
                        <button
                            onClick={() => deleteCart()}
                            className="w-60 px-6 py-3 border-2 border-yellow-100 text-yellow-100 font-semibold rounded-lg hover:bg-yellow-100 hover:text-zinc-600 transition duration-300 relative"
                        >
                            Confirm
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
