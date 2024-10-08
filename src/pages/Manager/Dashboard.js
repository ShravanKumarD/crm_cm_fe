import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  ProgressBar,
  Button,
} from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import "./Dashboard.css";
import "./../../App.css";
import { Chart, ArcElement } from "chart.js";

const Dashboard = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState(0);
  const [showAllLeads, setShowAllLeads] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const response = await axios.get("/lead/");
        if (response.status === 200) {
          const processedData = processLeadsData(response.data.leads);
          setLeadsData(processedData);
          setLeads(response.data.leads);
          setTotalLeads(response.data.leads.length);
        } else {
          console.error("Error: Response not OK", response.status);
        }
      } catch (error) {
        console.error("Error fetching leads data:", error);
      }
    };
    fetchLeadsData();
  }, []);

  useEffect(() => {
    fetchEmployee();
    fetchTasks();
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
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/task/");

      // Assuming response.data is an array of tasks
      const sortedTasks = response.data.sort((a, b) => {
        const dateA = new Date(a.createdDate);
        const dateB = new Date(b.createdDate);
        return dateA - dateB; // Sort in ascending order
      });

      // Set the tasks state
      setTasks(sortedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
      setError("Failed to fetch tasks.");
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
  const today = new Date().toISOString().split("T")[0];
  const newLeadsCount = leads.filter((lead) => {
    const assignedDate = new Date(lead.dateImported)
      .toISOString()
      .split("T")[0];
    return assignedDate === today && lead.status === "New";
  }).length;

  return (
    <div className="global-container">
      <div className="container">
        <Row>
          {[
            { title: "Total Leads", count: totalLeads },
            { title: "Today Leads", count: newLeadsCount },
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
          <Card.Body>
            <h1>Recent Lead Activities</h1>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>assignedDate</th>
                  <th>Last Activity</th>
                  <th>actionType</th>
                  <th>lead status</th>
                  <th>phone</th>
                  <th>createdDate</th>
                  <th>description</th>
                  <th>followUp</th>
                </tr>
              </thead>
              <tbody>
                {(showAllLeads ? tasks : tasks.slice(0, 3)).map(
                  (tasks, index) => (
                    <tr key={index}>
                      <td>{tasks.lead.name}</td>
                      <td>{tasks.status}</td>
                      <td>{tasks.user.name || "Not Assigned"}</td>
                      <td>{tasks.lead.assignedDate}</td>
                      <td>{tasks.lastActivity || "N/A"}</td>
                      <td>{tasks.actionType}</td>
                      <td>{tasks.lead.status || "N/A"}</td>
                      <td>{tasks.lead.phone}</td>
                      <td>
                        {new Date(tasks.createdDate).toLocaleTimeString([], {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td>{tasks.description || "N/A"}</td>
                      <td>{tasks.followUp || "N/A"}</td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
            <button
              className="btn btn-light btn-sm"
              onClick={() => setShowAllLeads(!showAllLeads)}
            >
              {showAllLeads ? "Show Less" : "Show More..."}
            </button>
          </Card.Body>

          {/* Upcoming Tasks */}
          {/* <Col md={4}>
              <Card>
                <Card.Body>
                  <h1>Upcoming Tasks</h1>
                  <ul className="task-list">
                    {tasks.map((task, index) => (
                      <li key={index}>
                        {task.title} <br />
                        <span>Due: {task.dueDate}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col> */}
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
