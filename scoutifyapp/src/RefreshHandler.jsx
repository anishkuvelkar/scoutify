import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefreshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsAuthenticated(true);
            // Redirect only if the user is not already on the analysis page
            if (
                location.pathname === '/' ||
                location.pathname === '/home' ||
                location.pathname === '/contact' ||
                location.pathname === '/about' ||
                location.pathname === '/clients'
            ) {
                navigate('/analysis', { replace: true });
            }
        } else {
            // If no token, ensure isAuthenticated is set to false
            setIsAuthenticated(false);
        }
    }, [location, navigate, setIsAuthenticated]);

    return null;
}

export default RefreshHandler;
