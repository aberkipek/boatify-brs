import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import useSession from '../hooks/useSession';
import useSessionRedirect from '../hooks/useSessionRedirect';
import useSessionCountdown from '../hooks/useSessionCountdown';
import '../styles/Home.css';
import AdminUI from './AdminUI';
import UserUI from './UserUI';
import SessionPopup from './SessionPopup';

const Home = () => {
    useSessionRedirect(false);
    const { userData, handleLogout } = useSession();
    const { timeLeft, extendSession, showPopup } = useSessionCountdown({ onLogout: handleLogout });

    return (
        <div className="home-container">
            <Navbar />
            {userData && userData.role === 'Admin' ? (
                <AdminUI />
            ) : (
                <UserUI userData={userData} />
            )}
            <Footer />
            {showPopup && (
                <SessionPopup
                    timeLeft={timeLeft}
                    onExtend={extendSession}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
};

export default Home;
