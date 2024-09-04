import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { FaTasks, FaUserAlt, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import axios from './../../components/axios'; 
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [showAll, setShowAll] = useState(false); // State to manage visibility of all tasks
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAssignedLeads();
    fetchEmployee();
    fetchLeadDetails();
    fetchTasks();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${user.id}`);
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err.message);
      setError('Failed to fetch employees.');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/task/');
      const filteredTasks = response.data.filter(task => task.userId === user.id);
      setTasks(filteredTasks);

      // Calculate completed tasks and upcoming meetings
      const completed = filteredTasks.filter(task => task.status === 'Completed').length;
      setCompletedTasks(completed);

      // Assuming 'dueDate' is a field in tasks, calculate upcoming meetings
      const today = new Date();
      const upcoming = filteredTasks.filter(task => new Date(task.dueDate) > today).length;
      setUpcomingMeetings(upcoming);
      
    } catch (err) {
      console.error('Failed to fetch tasks:', err.message);
      setError('Failed to fetch tasks.');
    }
  };

  const fetchAssignedLeads = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/leadAssignment/user-leads/${user.id}`);
      if (response.status === 200) {
        const leadIds = response.data.leads.map(lead => lead.leadId);
        setTotalLeads(leadIds.length);
        fetchLeadDetails(leadIds);
      }
    } catch (error) {
      console.error('Error fetching assigned leads:', error.message);
      setError('Failed to fetch assigned leads.');
    }
  };

  const fetchLeadDetails = async (leadIds = []) => {
    try {
      const response = await axios.get('http://localhost:3000/lead/');
      if (response.status === 200) {
        const filteredLeads = response.data.leads.filter(lead => leadIds.includes(lead.id));
        setLeads(filteredLeads.map(lead => ({
          ...lead,
          assignedTo: lead.assignedTo || "Not Assigned"
        })));
      }
    } catch (error) {
      console.error('Error fetching lead details:', error.message);
      setError('Failed to fetch lead details.');
    }
  };

  const handleAddTask = (lead) => {
    navigate('/add-task-employee', { state: { lead } });
  };

  const handleScheduleTask = () => {
    navigate('/scheduled-tasks');
  };

  return (
    <Container fluid className="global-container">
      <div className='container'>
        <Row>
          {/* Overview Section */}
          <Col md={12} className="mb-4">
            <Card className="dashboard-card overview-card">
              <Card.Body>
                <h2 className="text-center">Employee Dashboard</h2>
                <Row className="text-center">
                  <Col md={3}>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaTasks size={40} className="metric-icon" />
                        <h3>{totalLeads}</h3>
                        <p>Total Leads</p>
                      </Card.Body>
                    </Card> 
                  </Col>
                  <Col md={3}>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaChartBar size={40} className="metric-icon" />
                        <h3>{completedTasks}</h3>
                        <p>Completed Tasks</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaCalendarAlt size={40} className="metric-icon" />
                        <h3>{upcomingMeetings}</h3>
                        <p>Upcoming Meetings</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaUserAlt size={40} className="metric-icon" />
                        <h3>{performanceScore}%</h3>
                        <p>Performance Score</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Recent Activities Section */}
          <Col md={8} className="mb-4">
            <Card className="dashboard-card">
              <Card.Body>
                <h3>Recent Activities</h3>
                <ul className="activity-list">
                  {tasks.slice(0, 3).map(task => (
                    <li key={task.id}>
                      {task.title}: {task.description} (Due: {task.dueDate})
                    </li>
                  ))}
                </ul>
                {tasks.length > 3 && (
                  <button className="btn btn-link" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : 'Read More'}
                  </button>
                )}
                {showAll && (
                  <ul className="activity-list">
                    {tasks.slice(3).map(task => (
                      <li key={task.id}>
                        {task.title}: {task.description} (Due: {task.dueDate})
                      </li>
                    ))}
                  </ul>
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
                  <li><button className="btn btn-primary" onClick={() => handleAddTask(leads)}>Create New Task</button></li>
                  <li><button className="btn btn-secondary" onClick={handleScheduleTask}>View Upcoming Meetings</button></li>
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
