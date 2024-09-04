import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ScheduledTasks() {
    const [search, setSearch] = useState('');
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
    );

    const fetchTasks = () => {
        // API call to fetch tasks from server
        axios.get('http://localhost:3000/task/')
            .then(response => {
                const filteredTasks = response.data.filter(task => task.userId === user.id);
                setTasks(filteredTasks);
            })
            .catch(error => {
                console.error('There was an error fetching the tasks!', error);
            });
    };

    const handleNavigate = (task) => {
        navigate('/update-task-form', { state: { task } });
    };

    const handleDelete = (taskId) => {
        axios.delete(`http://localhost:3000/task/${taskId}`)
            .then(response => {
                console.log(response.data);
                // Refresh the task list after successful deletion
                fetchTasks();
            })
            .catch(error => {
                console.error('There was an error deleting the task!', error);
            });
    };

    return (
        <div className='global-container'>
            <Container>
                <Row className="mb-4">
                    <Col md={8}>
                        <h2>Scheduled Tasks</h2>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search tasks"
                                value={search}
                                onChange={handleSearchChange}
                            />
                            <InputGroup.Text>
                                <Button variant="outline-secondary">Search</Button>
                            </InputGroup.Text>
                        </InputGroup>
                    </Col>
                </Row>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            {/* <th>Due Date</th> */}
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => (
                                <tr key={task.id}>
                                    <td>{task.id}</td>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    {/* <td>{task.dueDate}</td> */}
                                    <td>
                                        <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Button variant="info" size="sm" className="mr-2" onClick={() => handleNavigate(task)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(task.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No tasks found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}
