import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        role: '',
        department: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:3000/auth/signup', formData);
            console.log(response.data);
            if (response.data) {
                console.log('fdfh')
                window.location.href = "/login";
                // navigate('/login');
            } else {
                alert('Signup failed: ' + response.data.message || 'Unknown error');
            }
           
        } catch (error) {
            alert('Signup failed: ' + error.response.data.message);
        }
    };

    return (
        <div>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="mobile">Mobile</label>
                <input
                    type="text"
                    className="form-control"
                    id="mobile"
                    name="mobile"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                    className="form-control"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="">Select Role</option>
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_MANAGER">Manager</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                    type="text"
                    className="form-control"
                    id="department"
                    name="department"
                    placeholder="Enter your department"
                    value={formData.department}
                    onChange={handleChange}
                />
            </div>
            <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleSignup}
            >
                Signup
            </button>
        </div>
    );
};

export default SignupPage;
