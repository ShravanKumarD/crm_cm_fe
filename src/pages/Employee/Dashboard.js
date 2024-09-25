import React, { useState, useEffect } from "react";
import { Card, Col, Row, Container, Button,Table } from "react-bootstrap";
import { FaTasks, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import axios from "./../../components/axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  console.log("amdin dash");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState(0);
  const [leadsByDay, setLeadsByDay] = useState({});
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [leadsAssignedToday, setleadsAssignedToday] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  
  useEffect(() => {
    fetchAssignedLeads();
    fetchEmployee();
    fetchTasks();
    fetchLeads();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${user.id}`);
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err.message);
      setError("Failed to fetch employees.");
    }
  };
  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:3000/lead/");
      if (response.status === 200) {
        // const today = new Date().toISOString().split('T')[0];

        // const leadsToday = response.data.leads.filter(lead => {
        //     const assignedDate = new Date(lead.assignedDate).toISOString().split('T')[0];
        //     return assignedDate === today;
        // });

        setLeads(
          leadsToday.map((lead) => ({
            ...lead,
            assignedTo: lead.assignedTo || "Not Assigned",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching leads:", error.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/task/");
      const filteredTasks = response.data.filter(
        (task) => task.userId === user.id
      );
      console.log(response, "response");
      const completed = filteredTasks.filter(
        (task) => task.status === "Completed"
      ).length;
      const walkins = filteredTasks.filter(
        (task) => task.status === "Walk-ins"
      ).length;
  console.log(filteredTasks,"filteredTasksfilteredTasks")
      setCompletedTasks(completed);
      setUpcomingMeetings(walkins);
      const filtered = filteredTasks.filter((task) => {
        // Ensure follow-up is not null, not undefined, and not an empty string
        return task.followUp !== "N/A" && task.followUp !== "" && task.followUp !== null;
      });
     console.log(filtered,"filtered")
      setTasks(filtered .reverse());
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
      setError("Failed to fetch tasks.");
    }
  };




  const fetchAssignedLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/leadAssignment/user-leads/${user.id}`
      );
      if (response.status === 200) {
        let count = 0;
        const today = new Date().toISOString().split("T")[0];
        const AssignedToday = response.data.leads.filter((lead) => {
          const assignedDate = new Date(lead.assignedDate)
            .toISOString()
            .split("T")[0];
          if (assignedDate === today) {
            count++;
          }
          return assignedDate === today;
        });

        setleadsAssignedToday(count);

        const leadIds = response.data.leads.map((lead) => lead.leadId);
        setTotalLeads(leadIds.length);
        fetchLeadDetails(leadIds);
      }
    } catch (error) {
      console.error("Error fetching assigned leads:", error.message);
      setError("Failed to fetch assigned leads.");
    }
  };

  

  const fetchLeadDetails = async (leadIds = []) => {
    try {
      const response = await axios.get("http://localhost:3000/lead/");
      if (response.status === 200) {
        const filteredLeads = response.data.leads.filter((lead) =>
          leadIds.includes(lead.id)
        );
        setLeads(
          filteredLeads.map((lead) => ({
            ...lead,
            assignedTo: lead.assignedTo || "Not Assigned",
          }))
        );

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

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTask = () => {
    navigate("/add-task-employee", { state: { leads } });
  };

  const today = new Date().toDateString();
  const leadsToday = leadsByDay[today] || 0;

  return (
    <Container fluid className="global-container">
      <div className="container">
        <Row>
          {/* Overview Section */}
          <Col md={12} className="mb-4">
            <Card className="dashboard-card overview-card">
              <Card.Body>
                <h2 className="text-center">Employee Dashboard</h2>
                <Row className="text-center">
                  <Col md={4}>
                    <Card className="metric-card">
                      <Card.Body>
                        <div>
                          <p className="right-top">
                            today's leads: {leadsAssignedToday}/{totalLeads}
                          </p>
                        </div>
                        <FaTasks size={40} className="metric-icon" />
                        <h3>{totalLeads}</h3>
                        <p>Total Leads</p>
                        <p></p>
                        {/* <div className="text-right"> */}
                        {/* <small>{leadsAssignedToday}leads assigned today</small> */}
                        {/* </div> */}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaChartBar size={40} className="metric-icon" />
                        <h3>{completedTasks}</h3>
                        <p>Completed Tasks</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaCalendarAlt size={40} className="metric-icon" />
                        <h3>{upcomingMeetings}</h3>
                        <p>Walk-ins</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>


          <Col md={8} className="mb-4">
            <Card className="dashboard-card">
            <Card.Body>
                <h3>Recent Tasks</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Lead</th>
                    <th>Phone</th>
                      <th>Follow-up Date</th>
                      <th>Note</th>
                      <th>Action Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 3).map((task) => (
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
                                hour12:true, 
                              })
                            : "N/A"}
                        </td>
                        <td>{task.description}</td>
                        <td>{task.actionType}</td>
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
                      {tasks.slice(3).map((task) => (
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
                                hour12:true, 
                              })
                            : "N/A"}
                        </td>
                        <td>{task.description}</td>
                        <td>{task.actionType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Actions Section */}
          <Col md={4} className="mb-4">
            <Card className="dashboard-card">
              <Card.Body>
                <h3>Quick Actions</h3>
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
      </div>
    </Container>
  );
};

export default Dashboard;
