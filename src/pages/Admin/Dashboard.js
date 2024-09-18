import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, ProgressBar } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import './AdminDashboard.css';
import './../../App.css';
import { Chart, ArcElement } from 'chart.js';

Chart.register(ArcElement);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#b377e3'];

const AdminDashboard = () => {
  const [leadsData, setLeadsData] = useState([]);

  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/lead/');
        if (response.status === 200) {
          const processedData = processLeadsData(response.data.leads);
          setLeadsData(processedData);
        } else {
          console.error('Error: Response not OK', response.status);
        }
      } catch (error) {
        console.error('Error fetching leads data:', error);
      }
    };
    fetchLeadsData();
  }, []);

  const processLeadsData = (data) => {
    const statusCounts = data.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));
  };

  return (
    <div className='global-container'>
      <Container fluid>
        {/* Lead Summary Cards */}
        <Row className="mb-4">
          {[
            { title: 'Total Leads', count: 99 },
            { title: 'New Leads', count: 25 },
            { title: 'Contacted Leads', count: 15 },
            { title: 'Converted Leads', count: 60 },
          ].map(({ title, count }, index) => (
            <Col md={3} key={index}>
              <Card className="lead-summary-card">
                <Card.Body>
                  <h1>{title}</h1>
                  <h4>{count}</h4>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts and Progress */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="dashboard-chart-card">
              <Card.Body>
                <h1>Lead Source Overview</h1>
                <PieChart width={400} height={300}>
                  <Pie
                    data={leadsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="dashboard-chart-card">
              <Card.Body>
                <h1>Lead Conversion Progress</h1>
                <ProgressBar now={60} label={`${60}%`} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Lead Activities */}
        <Row>
          <Col md={8}>
            <Card>
              <Card.Body>
                <h1>Recent Lead Activities</h1>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Lead Name</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'John Doe', status: 'New', assignedTo: 'Jane Smith', lastActivity: '2 days ago' },
                      { name: 'Mary Johnson', status: 'Qualified', assignedTo: 'Tom Brown', lastActivity: '5 hours ago' },
                      { name: 'Michael Williams', status: 'Contacted', assignedTo: 'Sara Lee', lastActivity: '1 week ago' },
                    ].map((lead, index) => (
                      <tr key={index}>
                        <td>{lead.name}</td>
                        <td>{lead.status}</td>
                        <td>{lead.assignedTo}</td>
                        <td>{lead.lastActivity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Upcoming Tasks */}
          <Col md={4}>
            <Card>
              <Card.Body>
                <h1>Upcoming Tasks</h1>
                <ul className="task-list">
                  {[
                    { task: 'Follow up with John Doe', due: 'Tomorrow' },
                    { task: 'Send proposal to Mary Johnson', due: '2 days' },
                    { task: 'Schedule meeting with Michael Williams', due: '5 days' },
                  ].map((task, index) => (
                    <li key={index}>
                      {task.task} <br />
                      <span>Due: {task.due}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
