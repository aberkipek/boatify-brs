import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import UserProfile from '../assets/images/user-profile.png';
import '../styles/Navbar.css';

const Profile = ({ fullName, username, role, createdAt, onLogout, onClose }) => {
    return (
        <div className="profile-container" onClick={(e) => e.stopPropagation()}>
            <div>
                <h1>{fullName}</h1>
            </div>
            <div>
                <h2>@{username}</h2>
            </div>
            <div>
                <h3>Role: {role}</h3>
            </div>
            <div>
                <h3>Boatify member since: {createdAt}</h3>
            </div>
            <div>
                <button onClick={onLogout}>Log Out</button>
            </div>
        </div>
    );
};

const Navbar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await fetch('http://localhost:3001/session', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    console.log(data);
                } else {
                    console.error('No active session or error fetching session data');
                }
            } catch (error) {
                console.error('Error fetching session data:', error);
            }
        };

        fetchSessionData();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                setUserData(null);
                setShowProfile(false);
                navigate('/login');
            } else {
                console.error('Error logging out');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="navbar">
            <div>
                <img src={Logo} alt="Logo" onClick={() => window.location.reload()} />
            </div>
            <div className="profile-image-container" onClick={() => setShowProfile(!showProfile)}>
                <img src={UserProfile} alt="User Profile" />
                {showProfile && userData && (
                    <Profile
                        fullName={userData.fullName}
                        username={userData.username}
                        role={userData.role}
                        createdAt={userData.since}
                        onLogout={handleLogout}
                        onClose={() => setShowProfile(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Navbar;
