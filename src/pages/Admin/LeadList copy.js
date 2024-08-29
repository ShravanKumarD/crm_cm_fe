import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import "./LeadList.css"
import axios from './../../components/axios';   
// import axios from 'axios';
import "./../../App.css";

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [employees] = useState(["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"]);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        date: '',
        id: '',
        status: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const postData = async () => {
          console.log('Fetching leads...');
          try {
            const response = await fetch('http://localhost:3000/lead/',{
                method:'post'
            });
            
            if(response.ok ){
                const data = await response.json();
                console.log('Response:', data);
            }
          } catch (error) {
            console.error('Error fetching data:', error.message);
          }
        };
    
        postData();
      }, []);
    const handleViewLead = (lead) => {
        navigate('/lead-details', { state: { lead } });
    };

    const handleAssignLeads = (assignedTo) => {
        setLeads(leads.map(lead =>
            selectedLeads.includes(lead.id) ? { ...lead, assignedTo } : lead
        ));
        setSelectedLeads([]);
    };

    const handleRevertAssignments = () => {
        setLeads(leads.map(lead =>
            selectedLeads.includes(lead.id) ? { ...lead, assignedTo: null } : lead
        ));
        setSelectedLeads([]);
    };

    const handleCheckboxChange = (id) => {
        setSelectedLeads(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(leadId => leadId !== id)
                : [...prevSelected, id]
        );
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const filteredLeads = leads.filter(lead => {
        return (
            (filters.name ? lead.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
            (filters.date ? lead.AssignedDate === filters.date : true) &&
            (filters.id ? lead.id.toString() === filters.id : true) &&
            (filters.status ? lead.status.toLowerCase().includes(filters.status.toLowerCase()) : true)
        );
    });

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            console.log(jsonData,"jsondata")
            const importedLeads = jsonData.map((item, index) => ({
                id: leads.length + index + 1,
                name: item.name || item.Name,
                email: item.email || item.Email,
                status: item.status || item.Status,
                source: item.source || item.Source,
                mobile: item.mobile || item.Mobile || item.Age,
                AssignedDate: item.AssignedDate || item.Date || new Date().toISOString().split('T')[0],
                Gender: item.Gender || item.gender,
                leadOwner: item.leadOwner || item.LeadOwner,
                assignedTo: item.assignedTo || null,
            }));

            setLeads(prevLeads => [...prevLeads, ...importedLeads]);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <>
          <div className="global-container">
            <div className="container">
              <h1 className="text-left">Lead List</h1>
              <div className="row mb-3">
                {/* Filters Section */}
                <div className="col-md-12 mb-3">
                  <div className="filter-form row">
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
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        placeholder="Filter by Date"
                        value={filters.date}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        name="id"
                        className="form-control"
                        placeholder="Filter by ID"
                        value={filters.id}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        name="status"
                        className="form-control"
                        placeholder="Filter by Status"
                        value={filters.status}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Bulk Actions Section */}
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <select
                      className="form-control me-2"
                      onChange={(e) => handleAssignLeads(e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Assign to</option>
                      {employees.map(employee => (
                        <option key={employee} value={employee}>{employee}</option>
                      ))}
                    </select>
                    <button
                      className="btn btn-danger"
                      onClick={handleRevertAssignments}
                      disabled={selectedLeads.length === 0}
                    >
                      Revert Assignment
                    </button>
                  </div>
                </div>
                {/* File Upload Section */}
                <div className="col-md-6 mb-3">
                  <input
                    type="file"
                    className="form-control"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              {/* Table Section */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Lead No.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Gender</th>
                      <th>Status</th>
                      <th>Lead Source</th>
                      <th>Lead Owner</th>
                      <th>Assigned Date</th>
                      <th>Assigned To</th>
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
                        <td>{lead.mobile}</td>
                        <td>{lead.Gender}</td>
                        <td>{lead.status}</td>
                        <td>{lead.source}</td>
                        <td>{lead.leadOwner}</td>
                        <td>{lead.AssignedDate}</td>
                        <td>{lead.assignedTo || "Not Assigned"}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleViewLead(lead)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      );
};

export default LeadList;
