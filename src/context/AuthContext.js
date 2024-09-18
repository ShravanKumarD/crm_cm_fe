import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(null);

    const login = (userToken, userRole) => {
        setToken(userToken);
        setRole(userRole);
        localStorage.setItem('token', userToken); // Store token in localStorage for persistence
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token'); // Clear token from localStorage
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
