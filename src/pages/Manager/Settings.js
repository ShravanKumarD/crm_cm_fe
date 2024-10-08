import React, { useState, useEffect ,useMemo} from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from './../../components/axios';
export default function Settings() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        designation: '',
        otp: '',
        department: '',
        workingMode: '',
        role: '',
    });
    
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const user = useMemo(() => JSON.parse(localStorage.getItem("user")) || {}, []);

    useEffect(() => {
        const fetchEmployees = async () => {
            if (user?.id) {
                try {
                    const response = await axios.get(`/user/${user.id}`);
                    setEmployee(response.data);
                    setFormData(prevData => ({
                        ...prevData,
                        name: response.data.name || '',
                        email: response.data.email || '',
                        address: response.data.address || '',
                        designation: response.data.designation || '',
                        otp: response.data.otp || '',
                        department: response.data.department || '',
                        workingMode: response.data.workingMode || '',
                        role: response.data.role || '',
                    }));
                } catch (err) {
                    setError('Failed to fetch employee data.');
                    console.error(err);
                }
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

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            const updatedData = {
                name: formData.name,
                email: formData.email,
                address: formData.address,
                password: formData.newPassword,
                designation: formData.designation,
                otp: formData.otp,
                department: formData.department,
                workingMode: formData.workingMode,
                role: formData.role,
            };

            const response = await axios.put(`/user/${user.id}`, updatedData);

            if (response.status === 200) {
                console.log(response,"data")
                alert('User updated successfully!');
            } else {
                setError('Failed to update user information. No fields were modified.');
            }
        } catch (error) {
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
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Container>
        </div>
    );
}
