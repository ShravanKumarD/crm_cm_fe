import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Table } from "react-bootstrap";
import axios from "./../../components/axios";
import "./../../App.css";

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
  });
  const [leadStatuses, setLeadStatuses] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAssignedLeads();
    fetchEmployee();
  }, []);

  const fetchAssignedLeads = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/leadAssignment/user-leads/${user.id}`
      );
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
      const response = await axios.get("http://localhost:3000/lead/");
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
      const response = await axios.get(`http://localhost:3000/user/${user.id}`);
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
    console.log(lead,"leadIdleadId")
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
    setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
    }));
};
  const handleStatusChange = (leadId, newStatus) => {
    // Update the local state for the changed lead status
    setLeadStatuses((prevStatuses) => ({
      ...prevStatuses,
      [leadId]: newStatus,
    }));
  
    // Send the updated status to the backend
    updateLeadStatus(leadId, newStatus);
  };
  
  const updateLeadStatus = (leadId, newStatus) => {
    console.log(newStatus,"newStatus", user.id," user.id",leadId,"leadId")
    const updateTaskStatus = axios.post(`http://localhost:3000/task/`, {
      status: newStatus,
      userId: user.id,
      leadId: leadId,
    });
  
    const fetchLeadStatus = axios.put(`http://localhost:3000/lead/${leadId}`, {
      status: newStatus,
      userId: user.id,
    });
  
    const updateLeadAssignment = axios.put(`http://localhost:3000/leadAssignment/${leadId}`, {
      status: newStatus,
    });
  
    // Use Promise.all to execute the promises concurrently
    Promise.all([updateTaskStatus, fetchLeadStatus, updateLeadAssignment])
      .then((responses) => {
        const [taskResponse, leadResponse, leadAssignmentResponse] = responses;
        
        console.log(taskResponse.data);
  
        if (taskResponse.status === 200) {
          console.log(`Status for lead ${leadId} updated successfully`);
        }
      })
      .catch((error) => {
        console.error(`Error updating status for lead ${leadId}:`, error.message);
        setError(`Failed to update status for lead ${leadId}.`);
      });
  };
  

  return (
    <div className="global-container">
      <div className="container">
        <h1 className="text-left">{employees.name}</h1>
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
                <th>Added Date</th>
                <th>Lead Source</th>
                <th>Status</th>
                <th>Activity</th>
                <th>Action</th>
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
                  <td>{lead.dateImported.split("T")[0]}</td>
                  <td>{lead.leadSource || "NA"}</td>
                  <td>
                    {lead.status === "active" ? (
                      <Form.Control
                        as="select"
                        name="status"
                        value={leadStatuses[lead.id] || lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value)
                        }
                      >
                        <option value="">Select status</option>
                        <option value="RNR">RNR</option>
                        <option value="Switch Off">Switch Off</option>
                        <option value="Busy">Busy</option>
                        <option value="Call Back">Call Back</option>
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Not Working/Not Reachable">
                          Not Working/Not Reachable
                        </option>
                      </Form.Control>
                    ) : (
                      lead.status
                    )}
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
    </div>
  );
};

export default LeadList;
