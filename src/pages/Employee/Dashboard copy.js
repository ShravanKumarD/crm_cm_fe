import React, { useState, useEffect } from "react";
import { Card, Col, Row, Container, Button,Table,Form } from "react-bootstrap";
import { FaTasks, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import axios from "./../../components/axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
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
  const [task, setTask] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [latestTasks, setLatestTasks] = useState([]);


  

  
  useEffect(() => {
    fetchAssignedLeads();
    fetchEmployee();
    fetchTasks();
    fetchLeads();
    console.log(tasks,"task")
  }, []);

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
      const response = await axios.get("/lead/");
      if (response.status === 200) {
        const today = new Date().toISOString().split("T")[0];
        const leadsToday = response.data.filter(lead => {
          const createdDate = new Date(lead.createdDate).toISOString().split("T")[0];
          return createdDate === today;
        });
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
      const response = await axios.get(`/task/${user.id}`);
      
      // Filter out completed tasks and user-specific tasks
      const filteredTasks = response.data
        .filter(task => task.status !== "Completed");
  
      // Count Completed and Walk-ins tasks
      const completed = response.data.filter(
        task => task.userId === user.id && task.status === "Completed"
      ).length;
      
      const walkins = filteredTasks.filter(
        task => task.status === "Walk-ins"
      ).length;
  
      setCompletedTasks(completed);
      setUpcomingMeetings(walkins);
  
      const today = new Date();
      const twoDaysLater = new Date();
      twoDaysLater.setDate(today.getDate() + 2);
  
      // Filter upcoming tasks with valid follow-up date
      const upcomingTasks = filteredTasks
        .filter(task => task.followUp && task.followUp !== "N/A")
        .map(task => ({
          ...task,
          followUpDate: new Date(task.followUp),
        }))
        .filter(task => task.followUpDate >= today && task.followUpDate <= twoDaysLater)
        .sort((a, b) => a.followUpDate - b.followUpDate);
  
      // Sort tasks with Pending status first
      const sortedTasks = upcomingTasks.sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (b.status === "Pending" && a.status !== "Pending") return 1;
        return 0;
      });

      setRecentActivities(recentActivities);
      setLatestTasks(upcomingTasks)
      
      setTasks(sortedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
      setError("Failed to fetch tasks.");
    }
  };

  


  const fetchAssignedLeads = async () => {
    try {
      const response = await axios.get(
        `/leadAssignment/user-leads/${user.id}`
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
  const handleTaskStatusChange = async (taskId, newStatus,task) => {
    try {
       const response = await axios.put(`/task/${taskId}`, {
        taskStatus: newStatus,
        userId: user.id,
        leadId: task.leadId,
      });
      console.log(response,"task status") 
      fetchTasks();  // Fetches the latest tasks including new upcoming ones
  
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };
  




  const fetchActivity = async () => {
  try {
      const response = await axios.get(`/task/${user.id}`);

      if (response && response.data) {
        // Filter the tasks by leadId
        const filteredTasks = response.data.filter(
          (taskItem) => taskItem.leadId === tasks.lead.id
        );
        setTask(filteredTasks);
      }
    } catch (error) {
      console.error("Error fetching task data:", error.message);
    }
  };
  

  const fetchLeadDetails = async (leadIds = []) => {
    try {
      const response = await axios.get("/lead/");
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
                <h3>Upcoming Walkins</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Lead</th>
                    <th>Phone</th>
                      <th>Follow-up Date</th>
                      <th>Action Type</th>
                      <th>Task Status</th>
                    </tr>
                  </thead>
                  <tbody>
  {tasks.slice(0, 3).map((task) => {
    const today = new Date();
    const followUpDate = new Date(task.followUp);

    // Check if the task is due today or overdue (before today)
    const isDueOrOverdue = followUpDate <= today;
    return (
      <tr key={task.id}>
        <td>
          {task.lead.name}<div className="blinking-light"></div>
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
        <td>{task.actionType}</td>
        <td>
          <Form.Control
            as="select"
            value={task.status}
            onChange={(e) => handleTaskStatusChange(task.id, e.target.value,task)}
            className="dropdownText"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </Form.Control>
        </td>
      </tr>
    );
  })}
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
                day: "numeric",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "N/A"}
        </td>
        <td>{task.actionType}</td>
        <td>
          <Form.Control
            as="select"
            value={task.taskStatus}
            onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
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
              </Card.Body>
            </Card>
          </Col>
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

<Col md={8} className="mb-4">
  <Card className="dashboard-card">
    <Card.Body>
      <h3>Latest 5 Tasks</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Task</th>
            <th>Lead</th>
            <th>Assigned To</th>
            <th>Creation Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {latestTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.lead.name}</td>
              <td>{task.assignedTo || "Not Assigned"}</td>
              <td>{new Date(task.createdDate).toLocaleDateString("en-GB")}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
</Col>
<Col md={8} className="mb-4">
  <Card className="dashboard-card">
    <Card.Body>
      <h3>Recent Activities</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Activity Type</th>
            <th>Details</th>
            <th>Date</th>
            <th>Lead</th>
          </tr>
        </thead>
        <tbody>
          {recentActivities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.type}</td>
              <td>{activity.details}</td>
              <td>{new Date(activity.date).toLocaleDateString("en-GB")}</td>
              <td>{activity.user}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
</Col>
        </Row>
      </div>
    </Container>
  );
};

export default Dashboard;
