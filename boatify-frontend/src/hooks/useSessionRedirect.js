import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useSessionRedirect = (redirectToHome) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:3001/session', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (redirectToHome && response.ok) {
                    navigate('/home');
                } else if (!redirectToHome && !response.ok) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error checking session:', error);

                if (!redirectToHome) {
                    navigate('/login');
                }
            }
        };

        checkSession();
    }, [navigate, redirectToHome]);
};

export default useSessionRedirect;
