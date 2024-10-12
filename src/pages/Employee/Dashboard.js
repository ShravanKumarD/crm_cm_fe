import React, { useState, useEffect } from "react";
import { Card, Col, Row, Container, Button, Table, Form } from "react-bootstrap";
import { FaTasks, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import axios from "./../../components/axios";
import "./Dashboard.css";
import { useNavigate,Link } from "react-router-dom";
import EmployeeSidebar from "../../components/Sidebar/EmployeeSidebar";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [walkins,setWalkins]=useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState(0);
  const [leadsByDay, setLeadsByDay] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [leadsAssignedToday, setLeadsAssignedToday] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 const [user,setUser]=useState('');
  console.log(user,"user in emp dash")

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData)
    if (user) {
      fetchAssignedLeads();
      fetchEmployee();
      fetchTasks();
      fetchLeads();
    }
  }, [user?.id]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/task/${taskId}`, {
        status: newStatus,
        userId: user.id,
      });
    await  fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/user/${user.id}`);
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err.message);
      setError("Failed to fetch employees.");
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get("/lead");
      if (response.status === 200) {
        setLeads(response.data.leads)
      }
    } catch (error) {
      console.error("Error fetching leads:", error.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/task/");
      const filteredTasks = response.data.filter(task => task.userId === user.id);
      setWalkins(filteredTasks.filter(task => task.status ==="customer walkin"))
      setTasks(filteredTasks.filter(task => task.status !== "Completed"));
      setCompletedTasks(filteredTasks.filter(task => task.status === "Completed").length);
      setUpcomingMeetings(filteredTasks.filter(task => task.status === "Walk-ins").length);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
      setError("Failed to fetch tasks.");
    }
  };
  const todayDate = new Date().toISOString().split("T")[0];
  const fetchAssignedLeads = async () => {
    try {
      const response = await axios.get(`/leadAssignment/user-leads/${user.id}`);
      if (response.status === 200) {
        setTotalLeads(response.data.leads.length);
        const today = new Date().toISOString().split("T")[0];
        const assignedToday = response.data.leads.filter(lead => {
          const assignedDate = new Date(lead.assignedDate).toISOString().split("T")[0];
          return assignedDate === todayDate;
        });
        setLeadsAssignedToday(assignedToday.length);
        const leadIds = response.data.leads.map(lead => lead.leadId);
        fetchLeadDetails(leadIds);
      }
    } catch (error) {
      console.error("Error fetching assigned leads:", error.message);
      setError("Failed to fetch assigned leads.");
    }
  };

  const fetchLeadDetails = async (leadIds = []) => {
    try {
      const response = await axios.get("/lead");
      if (response.status === 200) {
        const filteredLeads = response.data.leads.filter(lead => leadIds.includes(lead.id));
        setLeads(filteredLeads);
        const leadsCountByDay = filteredLeads.reduce((acc, lead) => {
          const date = new Date(lead.createdDate).toDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        setLeadsByDay(leadsCountByDay);
      }
    } catch (error) {
      console.error("Error fetching lead details:", error.message);
      setError("Failed to fetch lead details.");
    }
  };

  const handleAddTask = () => {
    navigate("/add-task-employee", { state: { leads } });
  };
  const isFollowUpPast = (followUpDate) => {
    const today = new Date();
    return new Date(followUpDate) < today;
  };
  const today = new Date().toISOString().split("T")[0];
  const todayLeadsCount = leads.filter((lead) => {
    const assignedDate = new Date(lead.dateImported)
      .toISOString()
      .split("T")[0];
    return assignedDate === today;
  }).length;
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return (
    <>
    <EmployeeSidebar/>
    <Container fluid className="global-container">
      <div className="container">
        <Row>
          <Col md={12}>
            <div>
              <Card.Body>
                {/* <h2 className="text-center">Employee Dashboard</h2> */}
                <Row className="text-center">
                  <Col md={4}>
                  <Link to={`/emp-leads`} className='text-decoration-none'>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaTasks size={40} className="metric-icon" />
                        <h3>{totalLeads}</h3>
                        <p>Total Leads</p>
                      </Card.Body>
                    </Card>
                    </Link>
                  </Col>
                  <Col md={4}>
                  <Link to={`/emp-leads`} className='text-decoration-none'>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaChartBar size={40} className="metric-icon" />
                        <h3>{leadsAssignedToday}/{totalLeads}</h3>
                        <p> Leads Today: {todayFormatted}</p>
                      </Card.Body>
                    </Card>
                    </Link>
                  </Col>
                  <Col md={4}>
                  <Link to={`/walkins-list`} className='text-decoration-none'>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaCalendarAlt size={40} className="metric-icon" />
                        <h3>{upcomingMeetings}</h3>
                        <p>Walk-ins</p>
                      </Card.Body>
                    </Card>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </div>
          </Col>
         <Col md={8}>
        <div> 
        <h2 className="text-center">Walkins</h2>
        {/* walkins */}
        <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Phone</th>
                      <th>Follow-up Date</th>
                      <th>Note</th>
                      <th>Lead Status</th>
                      <th>Task Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walkins.slice(0, 3).map(task => (
                      <tr key={task.id}>
                        
                        <td>
        {isFollowUpPast(task.followUp) && <div className="blinking-light"></div>}
        {task.lead.name}
      </td>
                        <td>{task.lead.phone}</td>
                        <td>
                          {task.followUp
                            ? new Date(task.followUp).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "N/A"}
                        </td>
                        <td>{task.description}</td>
                        <td>{task.lead.status || "N/A"}</td>  
                        <td>
                          <Form.Control
                            as="select"
                            value={task.status}
                            onChange={e => handleTaskStatusChange(task.id, e.target.value)}
                            className="dropdownText"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                          </Form.Control>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
        </div>
         </Col>
          <Col md={4} className="mb-4">
            <Card className="dashboard-card">
              <Card.Body>
              <h2 className="text-center">Quick Actions</h2>
                <ul className="quick-actions">
                  <li>
                    <Button variant="primary" onClick={handleAddTask}>
                      Create New Task
                    </Button>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
        <Col md={8} className="mb-4">
              <div>
                <h2 className="text-center">Recent Tasks</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Phone</th>
                      <th>Follow-up Date</th>
                      <th>Note</th>
                      <th>Lead Status</th>
                      <th>Task Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 3).map(task => (
                      <tr key={task.id}>
                        <td>{task.lead.name}</td>
                        <td>{task.lead.phone}</td>
                        <td>
                          {task.followUp
                            ? new Date(task.followUp).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "N/A"}
                        </td>
                        <td>{task.description}</td>
                        <td>{task.lead.status || "N/A"}</td>  
                        <td>
                          <Form.Control
                            as="select"
                            value={task.status}
                            onChange={e => handleTaskStatusChange(task.id, e.target.value)}
                            className="dropdownText"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                          </Form.Control>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {tasks.length > 3 && (
                  <Button
                    variant="link"
                    onClick={() => setShowAll(!showAll)}
                    className="readMore"
                  >
                    {showAll ? "Show Less" : "Read More"}
                  </Button>
                )}
                {showAll && (
                  <Table striped bordered hover>
                    <tbody>
                      {tasks.slice(3).map(task => (
                        <tr key={task.id}>
                          <td>{task.lead.name}</td>
                          <td>{task.lead.phone}</td>
                          <td>
                            {task.followUp
                              ? new Date(task.followUp).toLocaleDateString("en-GB", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : "N/A"}
                          </td>
                          <td>{task.description}</td>
                          {/* <td>{task.actionType}</td> */}
                          <td>{task.lead.status || "N/A"}</td>  
                          <td>
                          <Form.Control
                            as="select"
                            value={task.status}
                            onChange={e => handleTaskStatusChange(task.id, e.target.value)}
                            className="dropdownText"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                          </Form.Control>
                        </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
          </Col>
        </Row>
      </div>
    </Container>
    </>
  );
};

export default Dashboard;
