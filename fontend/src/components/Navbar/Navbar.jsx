import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-cart");
        setCartData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCart();
  }, []);

  return (
    <div className="flex bg-zinc-800 text-white px-8 py-4 items-center justify-between flex-col md:flex-row">
      <div>
        <Link to={`/`}>
          <h1 className="text-3xl text-yellow-100 font-semibold">บ้านนายดิน</h1>
        </Link>
      </div>
      <div className="flex gap-6 items-center flex-col md:flex-row">
        <div className="flex gap-14 py-2 flex-col text-center md:flex-row ">
          <Link to={`/`}>
            <div className="hover:text-orange-300 transition-all duration-300">Home</div>
          </Link>
          <div className="hover:text-orange-300 transition-all duration-300">About</div>
          <div className="hover:text-orange-300 transition-all duration-300">Shop</div>
          <div className="hover:text-orange-300 transition-all duration-300">Delivery Team</div>
          <div className="hover:text-orange-300 transition-all duration-300">Seller</div>
          <div className="hover:text-orange-300 transition-all duration-300">
          <Link to={`/Cart`} className="hover:text-orange-300 flex items-center relative">
            Cart
            <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-zinc-700 text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center absolute top-0 left-6">
              {cartData.length}
            </span>
          </Link>
          </div>
          

        </div>
      </div>
    </div>
  );
};

export default Navbar;
