import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./../../App.css";

const user = JSON.parse(localStorage.getItem("user")) || {};

export default function TaskForm({ leadData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lead } = location.state || leadData || {};

  const [task, setTask] = useState({
    description: "",
    status: "",
    userId: user.id || "",
    leadId: lead?.id || "",
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

  const [loanReport, setLoanReport] = useState({
    bankName: "",
    loanAmount: "",
    emi: "",
    outstanding: "",
    userId: user.id || "",
    leadId: lead?.id || "",
  });

  const [loanReportList, setLoanReportList] = useState([]);
  const [leadDetails, setLeadetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  // If no user ID and lead ID, display an empty form
  useEffect(() => {
    if (!user.id && !lead?.id) {
      setTask({
        description: "",
        status: "",
        userId: "",
        leadId: "",
        actionType: "",
        createdDate: "",
        updatedDate: "",
        followUp: "",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        company: "",
        salary: "",
      });
    }
  }, [user.id, lead]);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  const handleOptionChange = (e) => {
    setDocumentsCollected(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleLoanReportChange = (index, e) => {
    const { name, value } = e.target;
    const updatedReport = [...loanReport];
    updatedReport[index][name] = value;
  };

  const postLoanReport = async () => {
    console.log(loanReport, "loanReport");
    try {
      await axios.post("http://localhost:3000/loans-reports/", loanReport);
      alert("Loan report submitted successfully");
    } catch (error) {
      console.error("There was an error posting the loan report!", error);
    }
  };

  const getLoanReportList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/loans-reports/");
      setLoanReportList(response.data);
    } catch (error) {
      console.error("There was an error fetching the loan report list!", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedData = {
      ...task,
      ...formData,
      docsCollected: documentsCollected,
    };

    try {
      await axios.post("http://localhost:3000/task/", combinedData);
      alert("Task added successfully");
      await postLoanReport(); // Post loan report after the task submission
      navigate(-1);
    } catch (error) {
      console.error("There was an error creating the task!", error);
    }
  };

  useEffect(() => {
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
  }, [lead]);

  useEffect(() => {
    getLoanReportList();
    console.log(leadDetails, "leadDetails");
  }, []);

  useEffect(() => {
    setTask((prevTask) => ({
      ...prevTask,
      userId: user.id || "",
    }));
    fetchAssignedLeads();
  }, [user.id]);

  const fetchAssignedLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/leadAssignment/user-leads/${user.id}`
      );
      if (response.status === 200) {
        const leadIds = response.data.leads.map((lead) => lead.leadId);
        fetchLeadDetails(leadIds);
      }
    } catch (error) {
      console.error("Error fetching assigned leads:", error.message);
      setError("Failed to fetch assigned leads.");
    }
  };
  const fetchLeadDetails = async (leadIds) => {
    try {
      const response = await axios.get("http://localhost:3000/lead/");
      if (response.status === 200) {
        const filteredLeads = response.data.leads.filter((lead) =>
          leadIds.includes(lead.id)
        );
        setLeads(filteredLeads);
      }
    } catch (error) {
      console.error("Error fetching lead details:", error.message);
      setError("Failed to fetch lead details.");
    }
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleLeadSelect = (e) => {
    const selectedLeadId = e.target.value;
    const selected = leads.find((lead) => lead.id === selectedLeadId);
    setSelectedLead(selected);

    if (selected) {
      setFormData({
        name: selected.name,
        email: selected.email,
        phone: selected.phone,
        city: selected.city,
        company: selected.company,
        salary: selected.salary,
      });
      setTask((prevTask) => ({
        ...prevTask,
        leadId: selected.id,
      }));
    }
  };

  return (
    <div className="global-container">
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Activity</h2>
        <Form onSubmit={handleSubmit}>
          <h4>Personal Information</h4>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="formLeadId">
                <Form.Label>Lead Name</Form.Label>
                <Form.Control
                  as="select"
                  name="leadId"
                  value={task.leadId}
                  onChange={handleChange}
                  className="mt-2"
                >
                  <option value="">Select a lead</option>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
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
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
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
                  <Form.Group controlId="formActionType">
                    <Form.Label>Create Task</Form.Label>
                    <Form.Control
                      as="select"
                      name="actionType"
                      value={task.actionType}
                      onChange={handleChange}
                    >
                      <option value="">Select an action</option>
                      <option value="message">Message</option>
                      <option value="email">Email</option>
                      <option value="Call Back">Call Back</option>
                      <option value="schedule appointment with manager">
                        Schedule Appointment with Manager
                      </option>
                      <option value="customer walkin">Customer walkin</option>
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

          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Add Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Write here..."
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Are all documents collected?</Form.Label>
            <Form.Check
              type="radio"
              id="documentsCollectedYes"
              name="documentsCollected"
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
              name="documentsCollected"
              label="No"
              value="no"
              checked={documentsCollected === "no"}
              onChange={handleOptionChange}
              required
            />
          </Form.Group>

          {documentsCollected === "yes" && (
            <>
              <h5>Documents Collected</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Bank Name</th>
                    <th>Loan Amount</th>
                    <th>EMI</th>
                    <th>Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {loanReportList.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Control
                          type="text"
                          name="bankName"
                          value={row.bankName}
                          onChange={(e) => handleLoanReportChange(index, e)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          name="loanAmount"
                          value={row.loanAmount}
                          onChange={(e) => handleLoanReportChange(index, e)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          name="emi"
                          value={row.emi}
                          onChange={(e) => handleLoanReportChange(index, e)}
                        />
                      </td>
                      <td>
                        <Form.Contr ol
                          type="text"
                          name="outstanding"
                          value={row.outstanding}
                          onChange={(e) => handleLoanReportChange(index, e)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="secondary" onClick={postLoanReport}>
                Submit Loan Report
              </Button>
            </>
          )}
          <Button variant="info" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}
