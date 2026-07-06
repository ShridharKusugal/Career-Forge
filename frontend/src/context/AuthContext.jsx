import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Automatically send cookies (if any) and set the backend URL adaptively
axios.defaults.withCredentials = true;
axios.defaults.baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : 'https://career-forge-1.onrender.com';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Set token in header for the verification call
            axios.get('/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                setUser(res.data);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            })
            .catch(() => {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
            })
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (usernameOrEmail, password) => {
        const res = await axios.post('/api/auth/login', { usernameOrEmail, password });
        const data = res.data;
        if (data && data.token) {
            localStorage.setItem('token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data);
            return { success: true, token: data.token };
        }
        return { success: false, message: data?.message || 'Login failed' };
    };

    const register = async (username, email, password, role) => {
        await axios.post('/api/auth/register', { username, email, password, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
