import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

export default function Settings() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        notifications: true,
        integration1: false,
        integration2: false,
        privacyOption1: false,
        privacyOption2: false
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    return (
      <div className='global-container'>
        <Container className="my-5">
            <h2 className="text-center mb-4">Settings</h2>
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

                <Row>
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
                </Row>

                <Row>
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
                </Row>

                <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
            </Form>
        </Container>
        </div>
    );
}
