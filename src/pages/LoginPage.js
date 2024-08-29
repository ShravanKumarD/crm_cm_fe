import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username && password && role) {
            const normalizedRole = role.toUpperCase();
            const fullRole = `ROLE_${normalizedRole}`;
            // Store the user role in localStorage
            localStorage.setItem('user', JSON.stringify({ role: fullRole }));
            // Redirect to the appropriate dashboard
            navigate(`/${normalizedRole.toLowerCase()}-dashboard`);
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">CRM Login</h2>
                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <div className="input-group">
                    <label>Role</label>
                    <select onChange={(e) => setRole(e.target.value)} value={role}>
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="employee">Employee</option>
                    </select>
                </div>
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
