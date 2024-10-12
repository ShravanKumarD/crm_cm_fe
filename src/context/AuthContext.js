import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [role, setRole] = useState(null);
    const [decodedToken, setDecodedToken] = useState(null);
    const [user, setUser] = useState(null);

    
    const decodeJWT = (token) => {
        if (!token) {
            throw new Error("Token is required");
        }
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error("Invalid JWT format");
        }
        const payload = parts[1];
        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodedPayload);
    };

    useEffect(() => {
        if (token) {
            try {
                const decoded = decodeJWT(token);
                setDecodedToken(decoded);
                setRole(decoded.role);
                localStorage.setItem("user", JSON.stringify(decoded.user));
                setUser(decoded);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        } else {
            // Clear user if token is null
            setUser(null);
        }
    }, [token]);
    
  
    const login = (userToken,user) => {
        setToken(userToken);
        localStorage.setItem('token', userToken);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setDecodedToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
