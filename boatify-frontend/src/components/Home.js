import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import useSession from '../hooks/useSession';
import useSessionRedirect from '../hooks/useSessionRedirect';
import '../styles/Home.css';

const Home = () => {
    useSessionRedirect(false);
    const { userData } = useSession();

    return (
        <div className="home-container">
            <Navbar />
            {userData && userData.role === 'Admin' ? (
                <div>This is Admin page!</div>
            ) : (
                <div>This is homepage!</div>
            )}
            <Footer />
        </div>
    );
};

export default Home;
