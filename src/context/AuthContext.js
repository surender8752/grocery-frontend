import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("adminToken"));
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
        if (token) {
            // Verify token and get admin profile
            axios
                .get(`${API_URL}/admin/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setAdmin(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    logout();
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/admin/login`, {
                username,
                password,
            });

            const { token: newToken, admin: adminData } = response.data;
            localStorage.setItem("adminToken", newToken);
            setToken(newToken);
            setAdmin(adminData);

            // Set default authorization header
            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || "Login failed",
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/admin/register`, {
                username,
                email,
                password,
            });

            const { token: newToken, admin: adminData } = response.data;
            localStorage.setItem("adminToken", newToken);
            setToken(newToken);
            setAdmin(adminData);

            // Set default authorization header
            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || "Registration failed",
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        setToken(null);
        setAdmin(null);
        delete axios.defaults.headers.common["Authorization"];
    };

    // Set authorization header if token exists
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, [token]);

    return (
        <AuthContext.Provider
            value={{ admin, token, login, register, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};
