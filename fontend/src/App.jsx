import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ViewBookDetail from "./components/ViewBookDetails/ViewBookDetail";
import Cart from "./pages/Cart";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/view-book-detail/:id" element={<ViewBookDetail />} />
        <Route path="/Cart" element={<Cart/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
