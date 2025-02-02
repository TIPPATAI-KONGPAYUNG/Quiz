import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useParams, useNavigate } from 'react-router-dom';
import AddCart from '../AddCart';

const ViewBookDetail = () => {
    const { id } = useParams();
    const [Data, setData] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState(null);

    const increase = () => setQuantity(quantity + 1);
    const decrease = () => setQuantity(quantity > 0 ? quantity - 1 : 0);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(`http://localhost:1000/api/v1/get-book-by-id/${id}`);
                setData(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetch();
    }, [id]);

    const deleteBook = async () => {
        try {
            await axios.delete(`http://localhost:1000/api/v1/delete-book`, {
                headers: {
                    bookid: id
                }
            });
            useNavigate('/');
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const updateBook = async () => {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('price', formData.price);
        data.append('desc', formData.desc);
        if (file) {
            data.append('image', file);
        }

        try {
            await axios.put(`http://localhost:1000/api/v1/update-book`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'bookid': id
                }
            });
            setShowForm(false);
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const toggleForm = () => {
        setShowForm(prev => !prev);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <>
            {Data && (
                <div className='px-12 py-8 bg-zinc-900 flex flex-col md:flex-row gap-8'>
                    <div className='bg-zinc-800 rounded p-4 h-[60vh] lg:h-[88vh] w-full lg:w-3/6 flex flex-col md:flex-row items-center justify-center'>
                        <img src={`http://localhost:1000/upload/${Data.image}`} alt="/" className='h-[50vh] lg:h-[70vh]' />
                    </div>
                    <div className='p-4 w-full lg:w-3/6'>
                        <div className='flex justify-end'>
                            <button
                                className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-zinc-200 focus:outline-none rounded-full border focus:ring-gray-700 bg-zinc-800  border-zinc-600 hover:text-white hover:bg-zinc-700'
                                onClick={toggleForm}
                            >
                                Edit
                            </button>
                            <button
                                className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-zinc-200 focus:outline-none rounded-full border focus:ring-gray-700 bg-zinc-800  border-zinc-600 hover:text-white hover:bg-zinc-700'
                                onClick={deleteBook}
                            >
                                Delete
                            </button>
                        </div>

                        {showForm && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                                <div className="bg-zinc-800 text-white p-6 rounded-lg shadow-md w-[400px] relative">
                                    <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
                                    <input type="text" placeholder="Title" className="w-full p-2 mb-2 border rounded" name='title' value={Data.title} />
                                    <input type="text" placeholder="Author" className="w-full p-2 mb-2 border rounded" name='author' value={Data.author} />
                                    <input type="number" placeholder="Price" className="w-full p-2 mb-2 border rounded" name='price' value={Data.price} />
                                    <textarea placeholder="Description" className="w-full p-2 mb-2 border rounded" name='desc' value={Data.desc}></textarea>

                                    <div className="mb-4">
                                        <label className="text-white">Choose Image</label>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="w-full p-2 border rounded mt-2"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={toggleForm}>
                                            Cancel
                                        </button>
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={updateBook}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <h1 className='text-zinc-300 text-4xl font-semibold'>{Data.title}</h1>
                        <p className='text-zinc-400 mt-1'>{Data.author}</p>
                        <p className='text-zinc-500 mt-4 text-xl'>{Data.desc}</p>
                        <p className='mt-4 text-zinc-100 text-3xl font-semibold'>Price : {Data.price} THB</p>

                        <div className="mt-6 md:flex md:justify-center">
                            <div className="flex items-center gap-4 justify-center w-full md:w-auto text-center">
                                <button onClick={increase} className="px-4 py-2 border border-green-400 text-green-400 rounded hover:bg-green-500 hover:text-white w-12">
                                    +
                                </button>
                                <p className="text-zinc-300 text-lg font-semibold">{quantity}</p>
                                <button onClick={decrease} className="px-4 py-2 border border-red-400 text-red-400 rounded hover:bg-red-500 hover:text-white w-12">
                                    -
                                </button>
                            </div>
                        </div>


                        <div className='mt-6 md:justify-center'>
                            <AddCart bookid={Data._id} image={Data.image} title={Data.title} author={Data.author} price={Data.price} quantity={quantity} />
                        </div>
                    </div>
                </div>
            )}

            {!Data && <div className='h-screen bg-zinc-900 flex items-center justify-center'><Loader /></div>}
        </>
    );
};

export default ViewBookDetail;
