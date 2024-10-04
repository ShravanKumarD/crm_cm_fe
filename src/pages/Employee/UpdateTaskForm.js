import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const UpdateTaskForm = () => {
  const location = useLocation();
  const { task: initialTask } = location.state || {};

  // Initialize state with task data from location
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: '',
    userId: '',
    leadId: '',
    createdDate: '',
    updatedDate: '',
  });

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/task/${task.id}`, task)
      .then(response => {
        alert('Task updated successfully');
      })
      .catch(error => {
        console.error('There was an error updating the task!', error);
      });
  };

  return (
    <div className='global-container'>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="text-center mb-4">Update Task</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task title"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter task description"
                  name="description"
                  value={task.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
  <Form.Label>Status</Form.Label>
  <Form.Control
    as="select"
    name="status"
    value={task.status}
    onChange={handleChange}
    required
  >
    <option value="">Select status</option>
    <option value="Completed">Completed</option>
    <option value="Pending">Pending</option>
    <option value="Walk-ins">Walk-ins</option>
  </Form.Control>
</Form.Group>

              <Form.Group controlId="formUserId">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter user ID"
                  name="userId"
                  value={task.userId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLeadId">
                <Form.Label>Lead ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter lead ID"
                  name="leadId"
                  value={task.leadId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCreatedDate">
                <Form.Label>Created Date</Form.Label>
                <Form.Control
                  type="date"
                  name="createdDate"
                  value={task.createdDate}
                  onChange={handleChange}
                  // required
                />
              </Form.Group>
              <Form.Group controlId="formUpdatedDate">
                <Form.Label>Updated Date</Form.Label>
                <Form.Control
                  type="date"
                  name="updatedDate"
                  value={task.updatedDate}
                  onChange={handleChange}
                  // required
                />
              </Form.Group>
              <p>&nbsp;</p>
              <Button variant="primary" type="submit" block>
                Update Task
              </Button>
              <p>&nbsp;</p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UpdateTaskForm;
