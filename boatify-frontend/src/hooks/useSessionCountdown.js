import { useState, useEffect } from 'react';

const useSessionCountdown = ({ onLogout }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchSessionExpiration = async () => {
            const response = await fetch('http://localhost:3001/session', { credentials: 'include' });
            if (response.ok) {
                const maxAge = 5 * 60 * 1000;
                const expirationTime = Date.now() + maxAge;
                const remainingTime = expirationTime - Date.now();
                setTimeLeft(remainingTime);
            }
        };

        fetchSessionExpiration();
    }, []);

    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 60000 && !showPopup) {
            setShowPopup(true);
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1000) {
                    clearInterval(interval);
                    onLogout();
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, showPopup, onLogout]);

    const extendSession = async () => {
        const response = await fetch('http://localhost:3001/extend-session', {
            method: 'POST',
            credentials: 'include',
        });
        if (response.ok) {
            setTimeLeft(5 * 60 * 1000);
            setShowPopup(false);
        }
    };

    return { showPopup, timeLeft, extendSession };
};

export default useSessionCountdown;
