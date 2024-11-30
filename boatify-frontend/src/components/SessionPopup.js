import React from 'react';

const SessionPopup = ({ timeLeft, onExtend, onLogout }) => {
    return (
        <div className="session-popup">
            <div className="session-popup-content">
                <p>Session expires in {Math.ceil(timeLeft / 1000)} seconds!</p>
                <div className="session-popup-buttons">
                    <button onClick={onExtend} className="session-extend-button">
                        Continue
                    </button>
                    <button onClick={onLogout} className="session-logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionPopup;
