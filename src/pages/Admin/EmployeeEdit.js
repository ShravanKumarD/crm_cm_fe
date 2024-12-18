import React, { useState, useEffect } from 'react';
import axios from './../../components/axios';
import { useParams } from 'react-router-dom';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';

export default function EmployeeEdit() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        employeeId: id,
        name: '',
        email: '',
        address: '',
        password: '',
        designation: '',
        otp: 1122,
        department: '',
        workingMode: '',
        role: '',
        status: ''
    });

    const [error, setError] = useState(null);

    // Fetch user data to pre-fill the form on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/user/${id}`);
                setFormData(response.data);
            } catch (err) {
                setError('Failed to fetch user data.');
                console.error(err);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

    // Handle change in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/user/${id}`, formData);
            if (response.status === 200) {
                alert('User updated successfully!');
            } else {
                alert('User update failed. Please try again.');
            }
        } catch (error) {
            // Handle errors (network issues, server errors, etc.)
            console.error('Error submitting form:', error.message);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <>
        <AdminSidebar/>
        <div className="global-container">
            <div className="container my-5">
                <h2 className="text-center mb-4">Edit Employee</h2>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="employeeId">Employee ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="employeeId"
                                    name="employeeId"
                                    placeholder="Enter Employee ID"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Enter Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="address">Address</label>
                                <textarea
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    rows="3"
                                    placeholder="Enter Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="designation">Designation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="designation"
                                    name="designation"
                                    placeholder="Enter Designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* <div className="form-group mb-3">
                                <label htmlFor="otp">OTP</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="otp"
                                    name="otp"
                                    placeholder="Enter OTP"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    required
                                />
                            </div> */}
                            <div className="form-group mb-3">
                                <label htmlFor="department">Department</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="department"
                                    name="department"
                                    placeholder="Enter Department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="workingMode">Working Mode</label>
                                <select
                                    className="form-control"
                                    id="workingMode"
                                    name="workingMode"
                                    value={formData.workingMode}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Working Mode</option>
                                    <option value="remote">Remote</option>
                                    <option value="on-site">On-Site</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="role">Role</label>
                                <select
                                    className="form-control"
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Role</option>
                                    <option value="ROLE_ADMIN">Admin</option>
                                    <option value="ROLE_MANAGER">Manager</option>
                                    <option value="ROLE_EMPLOYEE">Employee</option>
                                </select>
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="status">Status</label>
                                <select
                                    className="form-control"
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
