import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import useSession from '../hooks/useSession';
import useSessionRedirect from '../hooks/useSessionRedirect';
import '../styles/Home.css';
import AdminUI from './AdminUI';
import UserUI from './UserUI';

const Home = () => {
    useSessionRedirect(false);
    const { userData } = useSession();

    return (
        <div className="home-container">
            <Navbar />
            {userData && userData.role === 'Admin' ? (
                <AdminUI />
            ) : (
                <UserUI />
            )}
            <Footer />
        </div>
    );
};

export default Home;
