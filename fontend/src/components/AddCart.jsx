import React, { useState } from 'react';
import axios from 'axios';
import Loader from './Loader/Loader';

const AddCart = ({ bookid, image, title, author, price, quantity }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const cartResponse = await axios.get('http://localhost:1000/api/v1/get-cart');
      const existingBook = cartResponse.data.data.find((item) => item.bookid === bookid);
  
      if (existingBook) {
        const updatedQuantity = existingBook.quantity + quantity;
        const updateResponse = await axios.put('http://localhost:1000/api/v1/update-cart', {
          bookid,
          quantity: updatedQuantity,
        });
  
        if (updateResponse.status === 200) {
          alert('Quantity updated in cart');
        }
      } else {
        const addResponse = await axios.post('http://localhost:1000/api/v1/add-to-cart', {
          bookid,
          image,
          title,
          author,
          price,
          quantity,
        });
  
        if (addResponse.status === 200) {
          alert('Book added to cart successfully');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Failed to add book to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-4 relative">
      <button
        onClick={handleAddToCart}
        className="w-60 px-6 py-3 border-2 border-yellow-100 text-yellow-100 font-semibold rounded-lg hover:bg-yellow-100 hover:text-zinc-600 transition duration-300 relative"
        disabled={loading}
        style={{ height: '50px' }}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          'Add To Cart'
        )}
      </button>
    </div>
  );
};

export default AddCart;
