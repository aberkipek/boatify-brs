import React from 'react';
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
                {/* Specific button class name */}
                <button className="profile-logout-btn" onClick={onLogout}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
