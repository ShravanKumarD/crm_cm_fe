import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

export default function TaskForm() {
    const location = useLocation();
    const { lead } = location.state || {};
    const [searchTerm, setSearchTerm] = useState('');
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: '',
        userId: '',
        leadId: '',
        actionType: '',
        createdDate: '',
        updatedDate: '',
        followUp: '' // Added followUp to the task state
    });

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};

    // Update task state with userId when component mounts
    useEffect(() => {
        setTask(prevTask => ({
            ...prevTask,
            userId: user.id || ''
        }));
    }, [user.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prevTask => ({
            ...prevTask,
            [name]: value
        }));
    };

    const filteredLeads = lead ? lead.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/task/', task)
            .then(response => {
                console.log(response.data);
                alert('Task added successfully');
            })
            .catch(error => {
                console.error('There was an error creating the task!', error);
            });
    };

    return (
        <div className="global-container">
            <div className="container mt-5">
                <h2 className="mb-4 text-center">Create Task</h2>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group controlId="formLeadId">
                                <Form.Label>Lead</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search leads..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Form.Control
                                    as="select"
                                    name="leadId"
                                    value={task.leadId}
                                    onChange={handleChange}
                                    className="mt-2"
                                >
                                    <option value="">Select a lead</option>
                                    {filteredLeads.length > 0 ? (
                                        filteredLeads.map(lead => (
                                            <option key={lead.id} value={lead.id}>
                                                {lead.id} - {lead.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No leads found</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Group controlId="formActionType">
                                <Form.Label>Action Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="actionType"
                                    value={task.actionType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select an action</option>
                                    <option value="call">Call</option>
                                    <option value="message">Message</option>
                                    <option value="email">Email</option>
                                    <option value="schedule">Schedule Appointment</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formFollowup" className="mt-3">
                                <Form.Label>Arrange for a follow-up</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="followUp"
                                    value={task.followUp}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={task.status}
                                    onChange={handleChange}
                                >
                                    <option value="">Select status</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Disqualified">Disqualified</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Not Contacted">Not Contacted</option>
                                    <option value="Contact in Future">Contact in Future</option>
                                    <option value="Not Connected">Not Connected</option>
                                    <option value="Walk in">Walk in</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="formDescription" className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            placeholder="Enter task description"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-4 w-100">
                        Submit
                    </Button>
                    <p>&nbsp;</p>
                </Form>
            </div>
        </div>
    );
}
