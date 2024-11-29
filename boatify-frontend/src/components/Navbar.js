import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import UserProfile from '../assets/images/user-profile.png';
import useSession from '../hooks/useSession';
import '../styles/Navbar.css';
import Profile from './Profile';

const Navbar = () => {
    const { userData, handleLogout } = useSession();
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => navigate(window.location.pathname)}>
                <img src={Logo} alt="Logo" />
            </div>
            {userData && (
                <div className="navbar-welcome-text">
                    <p>Welcome, <strong>{userData.fullName}</strong>!</p>
                </div>
            )}
            <div
                className={`navbar-profile-container ${showProfile ? 'show-profile' : ''}`}
                onClick={() => setShowProfile(!showProfile)}
            >
                <img src={UserProfile} alt="User Profile" className="navbar-profile-img" />
                {showProfile && userData && (
                    <div className="profile-dropdown">
                        <Profile
                            fullName={userData.fullName}
                            username={userData.username}
                            role={userData.role}
                            createdAt={userData.since}
                            onLogout={handleLogout}
                            onClose={() => setShowProfile(false)}
                        />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
