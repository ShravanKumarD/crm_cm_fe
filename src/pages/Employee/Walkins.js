import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Modal, Button, Form } from "react-bootstrap";
import axios from "./../../components/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../../App.css";

const Walkins = () => {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState({ leadId: null, taskType: "", followUpDate: null });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    fetchAssignedLeads();
  }, []);

  const fetchAssignedLeads = async () => {
    try {
      const response = await axios.get(`/leadAssignment/user-leads/${user.id}`);
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
      const response = await axios.get("/lead/");
      if (response.status === 200) {
        const filteredLeads = response.data.leads.filter((lead) => leadIds.includes(lead.id));
        const fetchTasks = async () => {
          try {
            const taskResponse = await axios.get(`/task/${user.id}`);
            if (taskResponse && taskResponse.data) {
              const tasks = taskResponse.data.reverse();
              const combinedLeadsWithTasks = filteredLeads.map((lead) => ({
                ...lead,
                tasks: tasks.filter((task) => task.leadId === lead.id),
              }));
              console.log(combinedLeadsWithTasks,"combinedLeadsWithTasks")
              const relevantLeads = combinedLeadsWithTasks.filter((lead) => {
                const recentTask = lead.tasks[0]?.actionType;
                return (
                  lead.status === "customer walkin" ||
                  lead.status === "schedule appointment with manager" ||
                  lead.status === "walkin"
                );
              });
              setLeads(relevantLeads);
            }
          } catch (error) {
            console.error("Error fetching task data:", error.message);
          }
        };
        fetchTasks();
      }
    } catch (error) {
      console.error("Error fetching lead details:", error.message);
      setError("Failed to fetch lead details.");
    }
  };

  const handleViewLead = (lead) => {
    navigate("/emp-lead-details", { state: { lead } });
  };

  const handleCheckboxChange = (id) => {
    setSelectedLeads((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((leadId) => leadId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setSelectedLeads(isChecked ? leads.map((lead) => lead.id) : []);
  };

  const handleTaskTypeChange = (leadId, taskType) => {
    setSelectedTask((prevTask) => ({ ...prevTask, leadId, taskType }));
  };

  const handleFollowUpDateChange = (leadId, date) => {
    setSelectedTask((prevTask) => ({ ...prevTask, leadId, followUpDate: date }));
  };

  const handleSubmitTask = async () => {
    try {
      const { leadId, taskType, followUpDate } = selectedTask;
      const taskData = {
        leadId,
        actionType: taskType,
        status:taskType,
        followUp: followUpDate,
        userId: user.id,
      };
     await axios.put(`/lead/${leadId}`, {
        status: taskType,
        userId: user.id,
      });
      await axios.post("/task/", taskData);
      alert("Task created successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error posting task:", error.message);
    }
  };

  const openModal = (leadId) => {
    setSelectedTask((prevTask) => ({ ...prevTask, leadId }));
    setShowModal(true);
  };

  const handleCreateTask = (lead) => {
    navigate("/add-task-employee", { state: { lead } });
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="global-container">
      <div className="container">
        <br />
        <div className="table-responsive">
          <Table striped>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>Lead Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Lead Source</th>
                <th>status</th>
                <th>Task Type</th>
                <th>Follow up date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleCheckboxChange(lead.id)}
                    />
                  </td>
                  <td>{lead.id}</td>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.leadSource || "NA"}</td>
                  <td>{lead.status}</td>
                  <td>
                    <Form.Select
                      className="dropdownInTable"
                      value={selectedTask.leadId === lead.id ? selectedTask.taskType : ""}
                      onChange={(e) => handleTaskTypeChange(lead.id, e.target.value)}
                    >
                      <option value="">{lead.tasks[0]?.actionType || "Select Task"}</option>
                      <option value="customer reschedule appointment">Customer Reschedule Appointment</option>
                      <option value="okay for the policy">Okay For the Policy</option>
                      <option value="not okay for the policy">Not Okay for the Policy</option>
                      <option value="think and get back">Think and get back</option>
                      <option value="not possible">Not Possible</option>
                    </Form.Select>
                  </td>
                  <td>
                    <DatePicker
                      className="dropdownInTable"
                      selected={selectedTask.leadId === lead.id ? selectedTask.followUpDate : null}
                      onChange={(date) => handleFollowUpDateChange(lead.id, date)}
                      showTimeSelect
                      dateFormat="dd-MM-yyyy HH:mm"
                      minDate={today}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openModal(lead.id)}
                    >
                      Update Task
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleViewLead(lead)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal for Confirmation */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Task Creation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to create this task for lead ID {selectedTask.leadId}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitTask}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Walkins;
