import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'; // We'll create this helper

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthTokenState] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Function to load user
    const loadUser = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token); // Set token in axios headers
        } else {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get('http://localhost:5000/api/auth'); // Endpoint to get user info
            setUser(res.data);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (err) {
            localStorage.removeItem('token');
            setAuthToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []); // Run once on component mount

    // Function to set token and update state
    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthTokenState(token);
        loadUser(); // Load user details after login
    };

    // Function to clear token and update state
    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null); // Clear axios header
        setAuthTokenState(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ authToken, isAuthenticated, user, loading, login, logout, setAuthToken: login }}>
            {children}
        </AuthContext.Provider>
    );
};