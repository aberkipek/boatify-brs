import React from "react";
import Footer from './Footer';
import Navbar from './Navbar';
import "../styles/Home.css";

const Home = () => {
    return (
        <div className="home-container">
            <Navbar />
            <Footer />
        </div>
    );
}

export default Home;
