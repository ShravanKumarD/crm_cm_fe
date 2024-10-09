import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import axios from "axios";
import "./AdminDashboard.css";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";

const AdminDashboard = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [showAllLeads, setShowAllLeads] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [dailyLeadsCount, setDailyLeadsCount] = useState({});

  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const response = await axios.get("/lead/");
        if (response.status === 200) {
          const processedData = processLeadsData(response.data.leads);
          setLeadsData(processedData);
          setLeads(response.data.leads);
          setTotalLeads(response.data.leads.length);
          const dailyCount = countLeadsByDate(response.data.leads);
          setDailyLeadsCount(dailyCount);
        } else {
          console.error("Error: Response not OK", response.status);
        }
      } catch (error) {
        setError("Error fetching leads data");
        console.error("Error fetching leads data:", error);
      }
    };
    fetchLeadsData();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);
  if (error) {
    return <p>{error}</p>;
  }
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/task/");
      const sortedTasks = response.data.sort((a, b) => {
        const dateA = new Date(a.createdDate || 0);
        const dateB = new Date(b.createdDate || 0);
        return dateA - dateB;
      });
      setTasks(sortedTasks);
    } catch (err) {
      setError("Failed to fetch tasks.");
      console.error("Failed to fetch tasks:", err.message);
    }
  };

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
  const countLeadsByDate = (data) => {
    return data.reduce((acc, lead) => {
      const date = new Date(lead.dateImported).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  };

  const today = new Date().toISOString().split("T")[0];
  const newLeadsCount = leads.filter((lead) => {
    const assignedDate = new Date(lead.dateImported)
      .toISOString()
      .split("T")[0];
    return assignedDate === today && lead.status === "New";
  }).length;
  const displayedTasks = showAllLeads ? tasks : tasks.slice(0, 3);
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
      {" "}
      <AdminSidebar />
      <div className="global-container">
        <Container fluid>
          <Row className="mb-4">
            {[
              { title: "Total Leads", count: totalLeads },
              { title: `Leads Today (${todayFormatted})`, count: todayLeadsCount },
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

          <Row>
            <Col md={12}>
              <Card.Body>
                <h1>Recent Lead Activities</h1>
                {error && <div className="error-message">{error}</div>}
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Lead Name</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Assigned Date</th>
                      <th>Last Activity</th>
                      <th>Action Type</th>
                      <th>Lead Status</th>
                      <th>Phone</th>
                      <th>Created Date</th>
                      <th>Description</th>
                      <th>Follow Up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedTasks.map((task, index) => (
                      <tr key={index}>
                        <td>{task.lead.name}</td>
                        <td>{task.status}</td>
                        <td>{task.user?.name || "Not Assigned"}</td>
                        <td>{task.lead.assignedDate}</td>
                        <td>{task.lastActivity || "N/A"}</td>
                        <td>{task.actionType}</td>
                        <td>{task.lead.status || "N/A"}</td>
                        <td>{task.lead.phone}</td>
                        <td>
                          {new Date(task.createdDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td>{task.description || "N/A"}</td>
                        <td>{task.followUp || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button
                  variant="touchable-global"
                  onClick={() => setShowAllLeads(!showAllLeads)}
                >
                  <h2>{showAllLeads ? "Show Less" : "Show More..."}</h2>
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AdminDashboard;
