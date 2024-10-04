import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Table, Modal } from "react-bootstrap"; // Import Modal
import axios from "./../../components/axios";
import "./../../App.css";
import DatePicker from "react-datepicker";
import ModalComponent from "./../../components/Modal";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    date: "",
    id: "",
    status: "",
    phone: "",
    leadStatus: "",
    source: "",
  });
  const [leadStatuses, setLeadStatuses] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [task, setTask] = useState({
    description: "",
    status: "",
    userId: user.id || "",
    leadId: "",
    actionType: "",
    createdDate: "",
    updatedDate: "",
    followUp: "",
  });

  const [leadFollowUpDates, setLeadFollowUpDates] = useState({});

  const openModal = (leadId) => {
    setCurrentLead(leadId);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setNote("");  
  };
  useEffect(() => {
    fetchAssignedLeads();
    fetchEmployee();
  }, []);

  const handleActionChange = (id, value) => {
    setSelectedAction(value);
    handleStatusChange(id, value); // Call the original status change function
  };

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
      // Fetch leads data
      const response = await axios.get("/lead/");
      console.log(response.data, "response");

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
      }
    } catch (error) {
      console.error("Error fetching lead details:", error.message);
      setError("Failed to fetch lead details.");
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/user/${user.id}`);
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err.message);
      setError("Failed to fetch employees.");
    }
  };

  const handleViewLead = (lead) => {
    navigate("/emp-lead-details", { state: { lead } });
  };

  const handleCreateTask = (lead) => {
    navigate("/add-task-employee", { state: { lead } });
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
    if (isChecked) {
      setSelectedLeads(leads.map((lead) => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleStatusChange = (leadId, newStatus) => {
    setCurrentLead(leadId);
    setNewStatus(newStatus);
    setShowModal(true);
  };

  const confirmStatusChange = () => {
    setLeadStatuses((prevStatuses) => ({
      ...prevStatuses,
      [currentLead]: newStatus,
    }));
    updateLeadStatus(currentLead, newStatus);
    setShowModal(false);
  };

  const postTask = async (leadId, followUp, note) => {
    const followUpDate = followUp
      ? new Date(followUp + "Z").toISOString()
      : null;
    const localFollowUpDate = followUpDate ? new Date(followUpDate) : null;
    let uid = user.id;
    const data = {
      userId: uid,
      leadId: leadId,
      followUp: localFollowUpDate,
      description:note,
    };
    const updateStatusInLeads = await axios.put(`/lead/${leadId}`, {
      status: newStatus || "Active",
      userId: user.id,
      followUp: localFollowUpDate,
      description:note,
      status:newStatus
    });

    try {
      const response = await axios.post("/task", data);
      if (response) {
        console.log("Task created successfully:", response.data,updateStatusInLeads);
        closeModal();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateLeadStatus = async (leadId) => {
    try {
      const response = await axios.post("/task/", {
        status: newStatus,
        userId: user.id,
        leadId: leadId,
        followUp: followUpDate,
        description: note,
      });
      const updateStatusInLeads = await axios.put(`/lead/${leadId}`, {
        status: newStatus || "Active",
        userId: user.id,
      });
      const updateLeadAssignment = await axios.put(
        `/leadAssignment/${leadId}`,
        { status: newStatus || "Active" }
      );

      console.log(
        "Response:",
        response,
        updateStatusInLeads,
        updateLeadAssignment
      );
      alert("Task created and lead status updated successfully!");
      closeModal();
    } catch (error) {
      console.error(`Error updating status for lead ${leadId}:`, error.message);
      setError(`Failed to update status for lead ${leadId}.`);
    }
  };
  const filteredLeads = leads.filter((lead) => {
    return (
      (filters.name === "" ||
        lead.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.date === "" ||
        lead.dateImported.split("T")[0] === filters.date) &&
      (filters.id === "" || lead.id.toString().includes(filters.id)) &&
      (filters.status === "" || lead.status === filters.status) &&
      (filters.phone === "" || lead.phone.includes(filters.phone)) &&
      (filters.leadStatus === "" || lead.status === filters.leadStatus) &&
      (filters.source === "" ||
        lead.leadSource.toLowerCase().includes(filters.source.toLowerCase()))
      // (filters.source === "" || lead.leadSource === filters.source)
    );
  });

  return (
    <div className="global-container">
      <div className="container">
        <h1 className="text-left">{employees.name}</h1>
        <div>
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Filter by Name"
                value={filters.name}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              {/* <label>Filter by Imported Date</label> */}
              <input
                type="date"
                name="date"
                className="form-control"
                placeholder="Filter by Imported Date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Filter by Phone"
                value={filters.phone}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <Form.Control
                as="select"
                name="leadStatus"
                className="form-control"
                value={filters.leadStatus}
                onChange={handleFilterChange}
              >
                <option value="">Filter by Lead Status</option>
                <option value="RNR">RNR</option>
                <option value="Switch Off">Switch Off</option>
                <option value="Busy">Busy</option>
                <option value="Call Back">Call Back</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Not Working/Not Reachable">
                  Not Working/Not Reachable
                </option>
                <option value="Follow Up">Follow Up</option>
              </Form.Control>
            </div>
            <p>&nbsp;</p>
            <div className="col-md-3">
              <input
                type="text"
                name="source"
                className="form-control"
                placeholder="Filter by Lead Source"
                value={filters.source}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
        <br />

        <div className="table-responsive">
          <Table striped>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Lead Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                {/* <th>Imported Date</th> */}
                <th>Assigned Date</th>
                <th>Lead Source</th>
                <th>Update Status</th>
                <th>Follow up date</th>
                <th>Activity</th>
                <th>Action</th>
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
                  <td>{lead.id || "NA"}</td>
                  <td>{lead.name || "NA"}</td>
                  <td>{lead.email || "NA"}</td>
                  <td>{lead.phone || "NA"}</td>
                  <td>{lead.dateImported.split("T")[0]}</td>
                  {/* <td>{lead.assignedDate||"NA"}</td> */}
                  <td>{lead.leadSource || "NA"}</td>
                  <td>
                    <Form.Control
                      as="select"
                      name="status"
                      className="dropdownInTable"
                      value={
                        leadStatuses[lead.id] || lead.status || "Task Created"
                      }
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value)
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="Interested">Interested</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Call Back">Call Back</option>
                      <option value="RNR">RNR (Ring No Response)</option>
                      <option value="Switch Off">Switched Off</option>
                      <option value="Busy">Busy</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Not Working/Not Reachable">
                        Not Working / Not Reachable
                      </option>
                      <option value="message">Message</option>
                      <option value="email">Email</option>
                      <option value="schedule appointment with manager">
                        Schedule Appointment with Manager
                      </option>
                      <option value="customer walkin">Customer Walk-in</option>
                    </Form.Control>
                  </td>

                  <td>
  <div className="touchable-global"  onClick={() => openModal(lead.id)}>
    {lead.tasks.length === 0 ? (
      <span>Add follow-up</span>
    ) : (
      <div key={lead.id}>
        <span>
          {lead.followUp ? (
            new Date(lead.followUp).toLocaleString()
          ) : (
            "No follow-up"
          )}
        </span>
      </div>
    )}
  </div>

  <ModalComponent
    showModal={isModalOpen}
    handleClose={closeModal}
    title="Add Follow-Up"
  >
                    <Form.Control
                      as="select"
                      name="status"
                      className="dropdownInTable"
                      value={
                        leadStatuses[lead.id] || lead.status || "Task Created"
                      }
                      onChange={(e) =>
                        handleStatusChange(currentLead, e.target.value)
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="Interested">Interested</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Call Back">Call Back</option>
                      <option value="RNR">RNR (Ring No Response)</option>
                      <option value="Switch Off">Switched Off</option>
                      <option value="Busy">Busy</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Not Working/Not Reachable">
                        Not Working / Not Reachable
                      </option>
                      <option value="message">Message</option>
                      <option value="email">Email</option>
                      <option value="schedule appointment with manager">
                        Schedule Appointment with Manager
                      </option>
                      <option value="customer walkin">Customer Walk-in</option>
                    </Form.Control>
                  <p>&nbsp;</p>

    <DatePicker
      className="dropdownInTable"
      showTimeSelect
      dateFormat="Pp"
      selected={followUpDate ? new Date(followUpDate) : null}
      onChange={(date) => setFollowUpDate(date)}
    />
    <Form.Group controlId="formDescription" className="mb-3">
      <Form.Label>Add Note</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write here..."
      />
    </Form.Group>
    <Button
      variant="btn btn-primary btn-sm"
      onClick={() => postTask(currentLead, followUpDate, note)} 
    >
      Submit
    </Button>
  </ModalComponent>
</td>

                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleCreateTask(lead)}
                    >
                      Add
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
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
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the status to "{newStatus}" for this
          lead?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmStatusChange}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeadList;
