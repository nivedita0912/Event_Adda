import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔁 Check if user already logged in (via cookie)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // 🔐 Login
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            setUser(data);
            return data;
        } catch (error) {
            if (error.response?.data?.needsVerification) {
                throw error.response.data;
            }
            throw error.response?.data?.message || 'Login failed';
        }
    };

    // 📝 Register
    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', {
                username: name,
                email,
                password,
            });

            return data; // { message, email }
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    // 🔢 Verify OTP
    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', {
                email,
                otp,
            });

            setUser(data);
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'OTP verification failed';
        }
    };

    // 🚪 Logout
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) { }

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                verifyOTP,
                logout,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;