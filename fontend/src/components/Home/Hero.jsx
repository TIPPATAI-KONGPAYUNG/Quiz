import React, { useEffect, useState } from 'react';
import axios from "axios";
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

const Hero = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        desc: '',
    });
    const [file, setFile] = useState(null);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:1000/api/v1/get-book/${currentPage}`);
                setData(response.data.data);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, [currentPage]);

    const AddBook = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("image", file);
            formDataToSend.append("title", formData.title);
            formDataToSend.append("author", formData.author);
            formDataToSend.append("price", formData.price);
            formDataToSend.append("desc", formData.desc);

            const addResponse = await axios.post('http://localhost:1000/api/v1/add-book', formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (addResponse.status === 200) {
                alert("Book added successfully!");
                setShowForm(false);
                setFormData({ title: '', author: '', price: '', desc: '' });
                setFile(null);
            }
        } catch (error) {
            console.log(error);
            alert('Failed to add book');
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleForm = () => {
        setShowForm(prev => !prev);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className='min-h-screen flex flex-col items-center relative'>
            <h1 className='text-4xl font-semibold text-yellow-100 text-center my-4'>Explore All Books Here</h1>

            <div className="w-full flex justify-end px-4 rounded">
                <button 
                    className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-zinc-200 focus:outline-none rounded-full border focus:ring-gray-700 bg-zinc-800  border-zinc-600 hover:text-white hover:bg-zinc-700" 
                    onClick={toggleForm}
                >
                    +
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                <div className="bg-zinc-800 p-6 rounded-lg shadow-md w-[400px] relative">
                        <h2 className="text-xl text-white font-semibold mb-4">Add New Book</h2>

                        <input type="text" placeholder="Title" className="w-full p-2 mb-2 border rounded" name='title' value={formData.title} onChange={handleChange} />
                        <input type="text" placeholder="Author" className="w-full p-2 mb-2 border rounded" name='author' value={formData.author} onChange={handleChange} />
                        <input type="number" placeholder="Price" className="w-full p-2 mb-2 border rounded" name='price' value={formData.price} onChange={handleChange} />
                        <textarea placeholder="Description" className="w-full p-2 mb-2 border rounded" name='desc' value={formData.desc} onChange={handleChange}></textarea>

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
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={AddBook}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!data.length && <Loader />}
            <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                {data.map((item, i) => (
                    <BookCard key={i} data={item} />
                ))}
            </div>

            <div className="flex justify-center gap-4 my-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-700 opacity-50 cursor-not-allowed' : 'focus:ring-gray-700 bg-zinc-800  border-zinc-600 text-white hover:bg-zinc-700'}`}
                >
                    Previous
                </button>

                <span className="text-lg font-semibold text-white">Page {currentPage} of {totalPages}</span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-700 opacity-50 cursor-not-allowed' : 'focus:ring-gray-700 bg-zinc-800  border-zinc-600 text-white hover:bg-zinc-700'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Hero;
