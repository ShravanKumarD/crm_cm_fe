import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./../../App.css";



const user = localStorage.getItem("user") || {};

export default function TaskForm({ leadData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lead } = location.state || leadData || {}; // Get lead data from props or state

  const [task, setTask] = useState({
    description: "",
    status: "",
    userId: user.id||"",
    leadId: lead.id || "",
    actionType: "",
    createdDate: "",
    updatedDate: "",
    followUp: "",
  });

  const [documentsCollected, setDocumentsCollected] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    company: "",
    salary: "",
  });

  const handleOptionChange = (e) => {
    setDocumentsCollected(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  useEffect(() => {
    setTask((prevTask) => ({
      ...prevTask,
      userId: user.id || "",
    }));

    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        city: lead.city || "",
        company: lead.company || "",
        salary: lead.salary || "",
      });
    }
  }, [user.id, lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine both task and form data for submission
    const combinedData = { ...task, ...formData, docsCollected:documentsCollected };
console.log(combinedData,'combine data')
    axios
      .post("http://localhost:3000/task/", combinedData)
      .then((response) => {
        console.log(response.data);
        alert("Task added successfully");
        navigate(-1);
      })
      .catch((error) => {
        console.error("There was an error creating the task!", error);
      });
  };

  return (
    <div className="global-container">
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Activity</h2>
        <Form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <h4>Personal Information</h4>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <div className="input-with-icon">
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                  <i className="fas fa-pen"></i>
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <div className="input-with-icon">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                  <i className="fas fa-pen"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formCity">
                <Form.Label>City</Form.Label>
                <div className="input-with-icon">
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                  />
                  <i className="fas fa-pen"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formCompany">
                <Form.Label>Company</Form.Label>
                <div className="input-with-icon">
                  <Form.Control
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                  />
                  <i className="fas fa-pen"></i>
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formSalary">
                <Form.Label>Salary</Form.Label>
                <div className="input-with-icon">
                  <Form.Control
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Enter salary"
                  />
                  <i className="fas fa-pen"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>
<p>&nbsp;</p>
          <Card className="mb-4">
  <Card.Body>
    <Row>
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
            <option value="RNR">RNR</option>
            <option value="Switch Off">Switch Off</option>
            <option value="Busy">Busy</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Not Working/Not Reachable">Not Working/Not Reachable</option>
          </Form.Control>
        </Form.Group>
      </Col>
    </Row>
  </Card.Body>
</Card>

          {/* Action Type and Follow-up in a Single Card */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="formActionType">
                    <Form.Label>Create Task</Form.Label>
                    <Form.Control
                      as="select"
                      name="actionType"
                      value={task.actionType}
                      onChange={handleChange}
                    >
                      <option value="">Select an action</option>
                      <option value="call back">Call Back</option>
                      <option value="message">Message</option>
                      <option value="email">Email</option>
                      <option value="schedule appointment">Schedule Appointment</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group controlId="formFollowup">
                    <Form.Label>Arrange for a follow-up</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="followUp"
                      value={task.followUp}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Status and Description */}
       

          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Add Note</Form.Label>
            <div className="input-with-icon">
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={task.description}
                onChange={handleChange}
                placeholder="Write here..."
              />
              <i className="fas fa-pen"></i>
            </div>
          </Form.Group>

          <Form.Group>
  <Form.Label>Are all documents collected?</Form.Label>
  <div className="d-flex require">
    <Form.Check
      type="radio"
      id="documentsCollectedYes"
      name="documentsCollected" // Added name attribute for grouping radio buttons
      label="Yes"
      value="yes"
      checked={documentsCollected === "yes"}
      onChange={handleOptionChange}
      className="me-3"
      required
    />
    <Form.Check
      type="radio"
      id="documentsCollectedNo"
      name="documentsCollected" // Added name attribute for grouping radio buttons
      label="No"
      value="no"
      checked={documentsCollected === "no"}
      onChange={handleOptionChange}
      required
    />
  </div>
</Form.Group>

          <p>&nbsp;</p>
          <Button variant="info" type="submit">
            Submit
          </Button>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
        </Form>
      </div>
    </div>
  );
}
