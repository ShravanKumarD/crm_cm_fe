import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Modal, Button, Form } from "react-bootstrap";
import axios from "./../../components/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../../App.css";
import { useAuth } from './../../context/AuthContext';
import ManagerSidebar from "../../components/Sidebar/ManagerSidebar";

const Walkins = () => {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState({ leadId: null, taskType: "", followUpDate: null });
  const [searchTerm, setSearchTerm] = useState(""); 
  const [note,setNote]=useState("")
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    fetchAssignedLeads();
  }, []);

  const fetchAssignedLeads = async () => {
    try {
      const response = await axios.get(`/leadAssignment/all-assigned`);
      if (response.status === 200) {
        const leadIds = response.data.map((lead) => lead.leadId);
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
            const taskResponse = await axios.get(`/task`);
            if (taskResponse && taskResponse.data) {
              const tasks = taskResponse.data.reverse();
              const combinedLeadsWithTasks = filteredLeads.map((lead) => ({
                ...lead,
                tasks: tasks.filter((task) => task.leadId === lead.id),
              }));
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
    navigate("/manager-lead-details", { state: { lead } });
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
        status: taskType,
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

  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <ManagerSidebar/>
    <div className="global-container">
      <div className="container">
        <br />
        {/* Search Input Field */}
        <Form.Group controlId="search">
          <Form.Control 
            type="text" 
            placeholder="Search by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </Form.Group>
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
                <th>Status</th>
                <th>Task Type</th>
                <th>Login Date</th>
                <th>Closing Date</th>
                <th>Follow up date</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
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
                      <option value="notPossible">Not Possible</option>
                      <option value="processCompleted">Completed</option>
                    </Form.Select>
                  </td>
                  <td>
                  <DatePicker
                      className="touchable-global"
                      selected={selectedTask.leadId === lead.id ? selectedTask.followUpDate : null}
                      // onChange={(date) => handleFollowUpDateChange(lead.id, date)}
                      placeholderText="select date"
                      showTimeSelect
                      dateFormat="dd-MM-yyyy HH:mm"
                      minDate={today}
                    />
                  </td>
                  <td>
                  <DatePicker
                      className="touchable-global"
                      selected={selectedTask.leadId === lead.id ? selectedTask.followUpDate : null}
                      // onChange={(date) => handleFollowUpDateChange(lead.id, date)}
                        placeholderText="select date"
                      showTimeSelect
                      dateFormat="dd-MM-yyyy HH:mm"
                      minDate={today}
                    />
                  </td>
                  <td>
                    <DatePicker
                      className="touchable-global"
                      selected={selectedTask.leadId === lead.id ? selectedTask.followUpDate : null}
                      onChange={(date) => handleFollowUpDateChange(lead.id, date)}
                        placeholderText="select date"
                      showTimeSelect
                      dateFormat="dd-MM-yyyy HH:mm"
                      minDate={today}
                    />
                  </td>
                  <td>
                  <Form.Control
        as="textarea"
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write here..."
      />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openModal(lead.id)}
                    >
                      Update
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
            <div><h2>Confirm Task Creation</h2></div>
          </Modal.Header>
          <Modal.Body>
            <p>
            Are you sure you want to create this task for lead ID {selectedTask.leadId}?</p>
          </Modal.Body>
          <Modal.Footer>
            <button classname="btn btn-primary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button   classname="btn btn-primary"  onClick={handleSubmitTask}>
              Confirm
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
    </>
  );
};

export default Walkins;
