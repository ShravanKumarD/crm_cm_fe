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
  const [creditReport, setCreditReport] = useState({
    creditCardName: "",
    totalOutstanding: "",
    userId: user.id || "",
    leadId: lead?.id || "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const [leads, setLeads] = useState([]);
  // const [selectedLead, setSelectedLead] = useState(null);

  const [data, setData] = useState({ loanReports: [], creditReports: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!lead?.id) {
        return; // If user.id is not available, exit early.
      }

      try {
        // No need to call .json(), Axios automatically parses JSON
        console.log(user.id, "userid");
        const loanReportsPromise = axios.get(
          `http://localhost:3000/loans-reports/${lead.id}`
        );
        const creditReportsPromise = axios.get(
          `http://localhost:3000/credit-reports/${lead.id}`
        );
        const [loanReportsResponse, creditReportsResponse] = await Promise.all([
          loanReportsPromise,
          creditReportsPromise,
        ]);
        // Set the fetched data
        setData({
          loanReports: loanReportsResponse.data,
          creditReports: creditReportsResponse.data,
        });
      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user?.id]);

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

  const handleLoanReportChange = (e) => {
    const { name, value } = e.target;

    setLoanReport((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const creditReportChange = (e) => {
    const { name, value } = e.target;
    setCreditReport((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const postLoanReport = async () => {
    console.log(loanReport, "loanReport");
    try {
      await axios.post("http://localhost:3000/loans-reports/", loanReport);
      alert("Loan report submitted succes sfully");
    } catch (error) {
      console.error("There was an error posting the loan report!", error);
    }
  };
  const postCreditReport = async () => {
    console.log(creditReport, "creditReport");
    try {
      await axios.post("http://localhost:3000/credit-reports/", creditReport);
      alert("Credit report submitted successfully");
    } catch (error) {
      console.error("There was an error posting the credit report!", error);
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
  // const handleLeadSelect = (e) => {
  //   const selectedLeadId = e.target.value;
  //   const selected = leads.find((lead) => lead.id === selectedLeadId);
  //   setSelectedLead(selected);

  //   if (selected) {
  //     setFormData({
  //       name: selected.name,
  //       email: selected.email,
  //       phone: selected.phone,
  //       city: selected.city,
  //       company: selected.company,
  //       salary: selected.salary,
  //     });
  //     setTask((prevTask) => ({
  //       ...prevTask,
  //       leadId: selected.id,
  //     }));
  //   }
  // };

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
              <h5>Loans Report</h5>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="bankName">Bank Name:</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    className="form-control"
                    value={loanReport.bankName}
                    onChange={handleLoanReportChange}
                    
                  />
                </div>
                <div className="col">
                  <label htmlFor="loanAmount">Loan Amount:</label>
                  <input
                    type="number"
                    id="loanAmount"
                    name="loanAmount"
                    className="form-control"
                    value={loanReport.loanAmount}
                    onChange={handleLoanReportChange}
                  
                  />
                </div>
                <div className="col">
                  <label htmlFor="emi">EMI:</label>
                  <input
                    type="number"
                    id="emi"
                    name="emi"
                    className="form-control"
                    value={loanReport.emi}
                    onChange={handleLoanReportChange}
                    
                  />
                </div>
                <div className="col">
                  <label htmlFor="outstanding">Outstanding Amount:</label>
                  <input
                    type="number"
                    id="outstanding"
                    name="outstanding"
                    className="form-control"
                    value={loanReport.outstanding}
                    onChange={handleLoanReportChange}
                    
                  />
                </div>
              </div>

              <Button variant="secondary" onClick={postLoanReport}>
                Add
              </Button>
              <br />
              <br />
              <>
                <h5>Credit Report</h5>
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="creditCardName">Credit Card Name:</label>
                    <input
                      type="text"
                      id="creditCardName"
                      name="creditCardName"
                      className="form-control"
                      value={creditReport.creditCardName}
                      onChange={creditReportChange}
                      
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="totalOutstanding">
                      Total Outstanding Amount:
                    </label>
                    <input
                      type="number"
                      id="totalOutstanding"
                      name="totalOutstanding"
                      className="form-control"
                      value={creditReport.totalOutstanding}
                      onChange={creditReportChange}
                      
                    />
                  </div>
                </div>

                <Button variant="secondary" onClick={postCreditReport}>
                  Add
                </Button>

                <br />
                <br />
               
                <div className="row">
  <div className="col-sm-8">
    <p><strong>Loan Report</strong></p>
    <table className="table">
      <thead>
        <tr>
          <th>Bank Name</th>
          <th>Loan Amount</th>
          <th>EMI</th>
          <th>Outstanding</th>
        </tr>
      </thead>
      <tbody>
        {data.loanReports.map((loan) => (
          <tr key={loan.id}>
            <td>{loan.bankName}</td>
            <td>{loan.loanAmount}</td>
            <td>{loan.emi}</td>
            <td>{loan.outstanding}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td><strong>Total</strong></td>
          <td>
            <strong>
              {data.loanReports.reduce((total, loan) => Number(total) + Number(loan.loanAmount), 0)}
            </strong>
          </td>
          <td>
            <strong>
              {data.loanReports.reduce((total, loan) => Number(total) + Number(loan.emi), 0)}
            </strong>
          </td>
          <td>
            <strong>
              {data.loanReports.reduce((total, loan) => Number(total) + Number(loan.outstanding), 0)}
            </strong>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div className="col-sm-4">
    <p><strong>Credit Reports</strong></p>
    <table className="table">
      <thead>
        <tr>
          <th>Credit Card Name</th>
          <th>Total Outstanding</th>
        </tr>
      </thead>
      <tbody>
        {data.creditReports.map((credit) => (
          <tr key={credit.id}>
            <td>{credit.creditCardName}</td>
            <td>{credit.totalOutstanding}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td><strong>Total</strong></td>
          <td>
            <strong>
              {data.creditReports.reduce((total, credit) => Number(total) + Number(credit.totalOutstanding), 0)}
            </strong>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

              </>
            </>
          )}
          <br />
          <br />
          <Button variant="info" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}
