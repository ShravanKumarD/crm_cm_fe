import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from './../../components/axios';

export default function Settings() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '', // New field
        currentPassword: '',
        newPassword: '',
        confirmPassword: '', // New field
        designation: '', // New field
        otp: '', // New field
        department: '', // New field
        workingMode: '', // New field
        role: '', // New field
    });
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    let user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`/user/${user.id}`);
                setEmployee(response.data);
                setFormData(prevData => ({
                    ...prevData,
                    name: response.data.name || '',
                    email: response.data.email || '',
                    address: response.data.address || '', // Initialize new field
                    designation: response.data.designation || '', // Initialize new field
                    otp: response.data.otp || '', // Initialize new field
                    department: response.data.department || '', // Initialize new field
                    workingMode: response.data.workingMode || '', // Initialize new field
                    role: response.data.role || '', // Initialize new field
                }));
            } catch (err) {
                setError('Failed to fetch employee data.');
                console.error(err);
            }
        };

        fetchEmployees();
    }, [user.id]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if new password matches the confirm password
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            // Prepare the data to be sent to the backend
            const updatedData = {
                name: formData.name,
                email: formData.email,
                address: formData.address, // Include new field
                password: formData.newPassword, // Send only the new password
                designation: formData.designation, // Include new field
                otp: formData.otp, // Include new field
                department: formData.department, // Include new field
                workingMode: formData.workingMode, // Include new field
                role: formData.role, // Include new field
            };

            const response = await fetch(`/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (response.status === 200) {
                alert('User updated successfully!');
            } else {
                setError('Failed to update user information. No fields were modified.');
            }
        } catch (error) {
            // Handle errors (network issues, server errors, etc.)
            console.error('Error submitting form:', error.message);
            setError('Please try again.');
        }
    };

    return (
        <div className='global-container'>
            <Container className="my-5">
                <h2 className="text-center mb-4">Settings</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <div className="card mb-4">
                                <div className="card-header">Profile Information</div>
                                <div className="card-body">
                                    <Form.Group controlId="formName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formAddress">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formDesignation">
                                        <Form.Label>Designation</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your designation"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formDepartment">
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your department"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formWorkingMode">
                                        <Form.Label>Working Mode</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your working mode"
                                            name="workingMode"
                                            value={formData.workingMode}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    {/* <Form.Group controlId="formRole">
                                        <Form.Label>Role</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                        />
                                    </Form.Group> */}
                                    {/* <Form.Group controlId="formOtp">
                                        <Form.Label>OTP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your OTP"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleChange}
                                        />
                                    </Form.Group> */}
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="card mb-4">
                                <div className="card-header">Account Settings</div>
                                <div className="card-body">
                                    <Form.Group controlId="formCurrentPassword">
                                        <Form.Label>Current Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Current password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formNewPassword">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="New password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formConfirmPassword">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm new password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* <Row>
                        <Col md={6}>
                            <div className="card mb-4">
                                <div className="card-header">Notification Preferences</div>
                                <div className="card-body">
                                    <Form.Group controlId="formNotifications">
                                        <Form.Check
                                            type="checkbox"
                                            label="Receive notifications"
                                            name="notifications"
                                            checked={formData.notifications}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="card mb-4">
                                <div className="card-header">Integrations</div>
                                <div className="card-body">
                                    <Form.Group controlId="formIntegration1">
                                        <Form.Check
                                            type="checkbox"
                                            label="Integration 1"
                                            name="integration1"
                                            checked={formData.integration1}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formIntegration2">
                                        <Form.Check
                                            type="checkbox"
                                            label="Integration 2"
                                            name="integration2"
                                            checked={formData.integration2}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Col>
                    </Row> */}

                    {/* <Row>
                        <Col md={6}>
                            <div className="card mb-4">
                                <div className="card-header">Privacy Settings</div>
                                <div className="card-body">
                                    <Form.Group controlId="formPrivacyOption1">
                                        <Form.Check
                                            type="checkbox"
                                            label="Privacy Option 1"
                                            name="privacyOption1"
                                            checked={formData.privacyOption1}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPrivacyOption2">
                                        <Form.Check
                                            type="checkbox"
                                            label="Privacy Option 2"
                                            name="privacyOption2"
                                            checked={formData.privacyOption2}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Col>
                    </Row> */}

                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Container>
        </div>
    );
}
