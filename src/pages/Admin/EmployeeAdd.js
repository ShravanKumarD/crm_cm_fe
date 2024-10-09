import React, { useState } from 'react';
import axios from './../../components/axios';
import { Modal, Button } from 'react-bootstrap';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';

export default function EmployeeAdd() {
    // State to manage form field values
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        email: '',
        mobile:'',
        address: '',
        password: '',
        designation: '',
        otp: '',
        department: '',
        workingMode: '',
        role: '',
        status: ''
    });
    const [showModal, setShowModal] = useState(false);
    // Handle change in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/', formData);
            if (response) {
                setShowModal(true);
            } else {
                alert('Form submission failed. Please try again.');
            }
        } catch (error) {
            // Handle errors (network issues, server errors, etc.)
            console.error('Error submitting form:', error.message);
            // Optionally, provide feedback to the user
            alert('An error occurred. Please try again.');
        }
    };
    

    return (
        <>
        <AdminSidebar/>
      <div className="global-container">
        <div className="container my-5">
            <h2 className="text-center mb-4">Add Employee</h2>
            <div className="row justify-content-center">
                <div className="col-md-8">
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
                            <label htmlFor="mobile">Mobile</label>
                            <input
                                type="mobile"
                                className="form-control"
                                id="mobile"
                                name="mobile"
                                placeholder="Enter mobile"
                                value={formData.mobile}
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
                        <div className="form-group mb-3">
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
                        </div>
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
                        <button type="submit" className="btn btn-primary btn-lg w-100">Submit</button>
                    </form>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <div><h2>Employee Created</h2></div>
                </Modal.Header>
                <Modal.Body>
                   <p>Employee has been created successfully!</p> 
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-primary' onClick={handleCloseModal}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
        </div>
        </>

    );
}
