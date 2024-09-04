import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './../../components/axios'; 
import "./../../App.css";

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        date: '',
        id: '',
        status: ''
    });
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchAssignedLeads();
        fetchEmployee();
    }, []);

    const fetchAssignedLeads = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/leadAssignment/user-leads/${user.id}`);
            if (response.status === 200) {
                const leadIds = response.data.leads.map(lead => lead.leadId);
                fetchLeadDetails(leadIds);
            }
        } catch (error) {
            console.error('Error fetching assigned leads:', error.message);
            setError('Failed to fetch assigned leads.');
        }
    };

    const fetchLeadDetails = async (leadIds) => {
        try {
            const response = await axios.get('http://localhost:3000/lead/');
            if (response.status === 200) {
                const filteredLeads = response.data.leads.filter(lead => leadIds.includes(lead.id));
                setLeads(filteredLeads.map(lead => ({
                    ...lead,
                    assignedTo: lead.assignedTo || "Not Assigned"
                })));
            }
        } catch (error) {
            console.error('Error fetching lead details:', error.message);
            setError('Failed to fetch lead details.');
        }
    };

    const fetchEmployee = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/user/${user.id}`);
            setEmployees(response.data);
        } catch (err) {
            console.error('Failed to fetch employees:', err.message);
            setError('Failed to fetch employees.');
        }
    };

    const handleViewLead = (lead) => {
        navigate('/emp-lead-details', { state: { lead } });
    };
   const handleCreateTask=(lead)=>{
    navigate('/', { state: { lead } });
   }
    const handleCheckboxChange = (id) => {
        setSelectedLeads(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(leadId => leadId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked);
        if (isChecked) {
            setSelectedLeads(leads.map(lead => lead.id));
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

    const filteredLeads = leads.filter(lead => {
        const formattedAssignedDate = lead.assignedDate.split('T')[0]; // Assuming `assignedDate` is in ISO format
        return (
            (filters.name ? lead.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
            (filters.date ? formattedAssignedDate === filters.date : true) &&
            (filters.id ? lead.id.toString() === filters.id : true) &&
            (filters.status ? lead.status.toLowerCase().includes(filters.status.toLowerCase()) : true)
        );
    });

    const sortLeads = (leadsList) => {
        return leadsList.sort((a, b) => {
            const statusA = a.status?.toLowerCase() || '';
            const statusB = b.status?.toLowerCase() || '';
            return statusA === 'inactive' && statusB !== 'inactive' ? 1 : 
                   statusA !== 'inactive' && statusB === 'inactive' ? -1 : 0;
        });
    };

    const sortedLeads = sortLeads(filteredLeads);

    const handleBulkStatusUpdate = async (status) => {
        console.log('Selected Leads:', selectedLeads, 'Status:', status);
    
        try {
            const response = await axios.put('http://localhost:3000/leadAssignment/bulk-update-status', {
                leadIds: selectedLeads, 
                status: status
            });
            const updateLead = await axios.put('http://localhost:3000/lead/update-leads', {
                leadIds: selectedLeads, 
                status: status
            });
            console.log('API Response:', response, updateLead);
            setLeads(prevLeads =>
                prevLeads.map(lead =>
                    selectedLeads.includes(lead.id) ? { ...lead, status } : lead
                )
            );
            setSelectedLeads([]);
        } catch (error) {
            console.error('Error updating lead status:', error.response ? error.response.data : error.message);
            setError('Failed to update lead status.');
        }
    };
    
    return (
        <div className="global-container">
            <div className="container">
                <h1 className="text-left">{employees.name}</h1>
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
                </div>

                <div className="mb-3 col-3">
                    <select
                        className="form-select"
                        onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                        defaultValue=""
                        disabled={selectedLeads.length === 0}>
                        <option value="" disabled>Action</option>
                        <option value="qualified">Qualified</option>
                        <option value="disqualified">Disqualified</option>
                        <option value="contacted">Contacted</option>
                        <option value="not contacted">Not Contacted</option>
                        <option value="contactInFuture">Contact in Future</option>
                        <option value="notconnected">Not Connected</option>
                        <option value="walkins">Walkins</option>
                    </select>   
                </div>
                {/* Table Section */}
                <div className="table-responsive">
                    <table className="table table-striped">
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

                                <th>Status</th>
                                <th>Lead Source</th>
                                <th>Lead Owner</th>
                                <th>Assigned Date</th>
                                {/* <th>Assigned To</th> */}
                                <th>Task</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedLeads.length > 0 ? (
                                sortedLeads.map(lead => (
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
                                        
                                        {/* <td>{lead.gender}</td> */}
                                        {/* <td>{lead.status}</td> */}
                                        <span className={`badge ${lead.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                                            {lead.status}
                                        </span>
                                        <td>{lead.leadSource}</td>
                                        <td>{lead.assignedTo}</td>
                                        <td>{lead.assignedDate.split('T')[0]}</td>
                                        {/* <td>{lead.assignedTo}</td> */}
                                        <td>
                                            <button className="btn btn-secondary" onClick={() => handleCreateTask(lead)}>Add</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleViewLead(lead)}>View</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12">No leads found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeadList;
