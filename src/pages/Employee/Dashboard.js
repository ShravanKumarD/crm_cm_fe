import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Container, Button } from 'react-bootstrap';
import { FaTasks, FaUserAlt, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import axios from './../../components/axios'; 
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  console.log("employee")
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [leadsByDay, setLeadsByDay] = useState({});
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
  
      // Calculate completed tasks and walk-ins
      const completed = filteredTasks.filter(task => task.status === 'Completed').length;
      const walkins = filteredTasks.filter(task => task.status === 'Walk-ins').length;
      const upcoming = filteredTasks.filter(task => new Date(task.dueDate) > new Date()).length;
  
      setCompletedTasks(completed);
      setUpcomingMeetings(walkins);  // If 'Walk-ins' refers to upcoming meetings
      setTasks(filteredTasks);
  
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


        const leadsCountByDay = filteredLeads.reduce((acc, lead) => {
          const date = new Date(lead.createdDate).toDateString(); // Adjust as needed
          acc[date] = (acc[date] || 0) + 1;
          console.log(leadsByDay,"")
          return acc;
        }, {});
        setLeadsByDay(leadsCountByDay);
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
                  <Col md={4}>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaTasks size={40} className="metric-icon" />
                        <h3>{totalLeads}</h3>
                        <p>Total Leads</p>
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
                  {/* <Col md={3}>
                    <Card className="metric-card">
                      <Card.Body>
                        <FaUserAlt size={40} className="metric-icon" />
                        <h3>{performanceScore}%</h3>
                        <p>Performance</p>
                      </Card.Body>
                    </Card>
                  </Col> */}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Recent Activities Section */}
          <Col md={8} className="mb-4">
            <Card className="dashboard-card">
              <Card.Body>
                <h3>Recent Tasks</h3>
                <ul className="activity-list">
                  {tasks.slice(0, 3).map(task => (
                    <li key={task.id}>
                      {task.title}: {task.createdDate.slice()} ( {task.followUp})
                    </li>
                  ))}
                </ul>
                {tasks.length > 3 && (
                  <Button variant="link" onClick={() => setShowAll(!showAll)} className='readMore'>
                    {showAll ? 'Show Less' : 'Read More'}
                  </Button>
                )}
                {showAll && (
                  <ul className="activity-list">
                    {tasks.slice(3).map(task => (
                      <li key={task.id}>
                        {task.title}: {task.followUp} (Due: {task.dueDate})
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
                  <li><Button variant="primary" onClick={() => handleAddTask(leads)}>Create New Task</Button></li>
                  {/* <li><Button variant="secondary" onClick={handleScheduleTask}>View Upcoming Meetings</Button></li> */}
                </ul>
              </Card.Body>
            </Card>
          </Col>


          {/* Leads by Day Section */}
          <Col md={4} className="mb-4">
            <Card className="dashboard-card">
              <Card.Body>
                <h3>Leads by Day</h3>
                <ul className="activity-list">
                  {Object.entries(leadsByDay).map(([date, count]) => (
                    <li key={date}>
                      {date}: {count} leads
                    </li>
                  ))}
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
