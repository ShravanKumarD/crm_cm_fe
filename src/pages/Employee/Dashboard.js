import React, { useState, useEffect } from "react";
import { Card, Col, Row, Container, Button, Table } from "react-bootstrap";
import { FaTasks, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import axios from "./../../components/axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/task/");
      const filteredTasks = response.data.filter(
        (task) => task.userId === user.id
      );
      setTasks(filteredTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
    }
  };

  return (
    <Container fluid className="global-container">
      <div className="container">
        <Row>
          <Col md={8} className="mb-4">
            <Card className="dashboard-card">
              <Card.Body>
                <h3>Recent Tasks</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Follow-up Date</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 3).map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.status}</td>
                        <td>
                          {task.followUp
                            ? new Date(task.followUp).toLocaleDateString("en-GB", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("en-GB")
                            : "N/A"}
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
                      {tasks.slice(3).map((task) => (
                        <tr key={task.id}>
                          <td>{task.title}</td>
                          <td>{task.status}</td>
                          <td>
                            {task.followUp
                              ? new Date(task.followUp).toLocaleDateString("en-GB", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </td>
                          <td>
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString("en-GB")
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Dashboard;
