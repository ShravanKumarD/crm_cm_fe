import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from './../../components/axios'; 
import "./LeadList.css";
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
    const [selectAll, setSelectAll] = useState(false); // State for "Select All"
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch leads data on component mount
        fetchLeads();
        fetchEmployees();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await axios.get('http://localhost:3000/lead/');
            if (response.status === 200) {
                setLeads(response.data.leads);
            }
        } catch (error) {
            console.error('Error fetching leads:', error.message);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3000/user');
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employees.');
            console.error(err);
        }
    };

    const handleDeleteLead = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/lead/${id}`);
            if (response.status === 200) {
                setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
                setSelectedLeads(prevSelected => prevSelected.filter(leadId => leadId !== id));
            } else {
                console.error(`Failed to delete lead with id ${id}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting lead:', error.message);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await Promise.all(
                selectedLeads.map(id => axios.delete(`http://localhost:3000/lead/${id}`))
            );
            setLeads(prevLeads => prevLeads.filter(lead => !selectedLeads.includes(lead.id)));
            setSelectedLeads([]);
        } catch (error) {
            console.error('Error deleting selected leads:', error.message);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const importedLeads = jsonData.map((item, index) => ({
                    id: leads.length + index + 1, // Generate a unique ID
                    name: item.name || item.Name || item.firstname + item.lastname || 'N/A',
                    email: item.email || item.Email || 'N/A',
                    status: item.status || item.Status || 'N/A',
                    source: item.source || item.Source || 'N/A',
                    phone: item.mobile || item.Mobile || item.Age || 'N/A',
                    dob: item.dob || item.dateOfBirth || item.dateofBirth || 'N/A',
                    company: item.company || item.organization || item.firm || 'N/A',
                    assignedDate: item.AssignedDate || item.Date || new Date().toISOString().split('T')[0] || 'N/A',
                    gender: item.Gender || item.gender || 'N/A',
                    city: item.city || item.City || 'N/A',
                    country: item.country || item.Country || 'N/A',
                    tags: item.tags || item.Tags || item.tag || 'N/A',
                    leadOwner: item.leadOwner || item.LeadOwner || 'N/A',
                    leadSource: item.leadSource || item.LeadSource || 'N/A',
                    assignedTo: item.assignedTo || 'N/A',
                }));

                setLeads(prevLeads => [...prevLeads, ...importedLeads]);
            } catch (err) {
                console.error('Error processing the file:', err);
            }
        };

        reader.readAsArrayBuffer(file);
    };

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

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };
    
    const isValidDate = (dateString) => {
        const date = parseDate(dateString);
        return !isNaN(date.getTime()); // Check if date is valid
    };
    
    const filteredLeads = leads.filter(lead => {
        const formattedAssignedDate = isValidDate(lead.assignedDate) 
            ? parseDate(lead.assignedDate).toISOString().split('T')[0] 
            : '';
    
        return (
            (filters.name ? lead.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
            (filters.date ? formattedAssignedDate === filters.date : true) &&
            (filters.id ? lead.id.toString() === filters.id : true) &&
            (filters.status ? lead.status.toLowerCase().includes(filters.status.toLowerCase()) : true)
        );
    });

    // Sorting function to push inactive leads to the end
    const sortLeads = (leadsList) => {
        return leadsList.sort((a, b) => {
            if (a.status.toLowerCase() === 'inactive' && b.status.toLowerCase() !== 'inactive') {
                return 1;
            }
            if (a.status.toLowerCase() !== 'inactive' && b.status.toLowerCase() === 'inactive') {
                return -1;
            }
            return 0;
        });
    };

    const sortedLeads = sortLeads(filteredLeads);

    return (
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
                    <div className="col-md-12 mb-3">
                        <div className="d-flex justify-content-between">
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteAll}
                                disabled={selectedLeads.length === 0}
                            >
                                Delete All
                            </button>
                            <div>
                                <select
                                    className="form-control"
                                    onChange={(e) => handleAssignLeads(e.target.value)}
                                >
                                    <option value="">Assign To</option>
                                    {employees.map(employee => (
                                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleRevertAssignments}
                                    disabled={selectedLeads.length === 0}
                                >
                                    Revert
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* File Upload Section */}
                    <div className="col-md-6 mb-3 position-relative">
                        <input
                            type="file"
                            className="form-control"
                            id="file-upload"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                            style={{ opacity: 0, position: 'absolute', zIndex: 1, width: '100%', height: '100%' }}
                        />
                        <label
                            htmlFor="file-upload"
                            className="form-control-file-placeholder d-flex justify-content-center align-items-center"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 0,
                                width: '100%',
                                height: '100%',
                                border: '1px solid #ced4da',
                                borderRadius: '.25rem',
                                cursor: 'pointer',
                                textAlign: 'center',
                                lineHeight: '2.5rem'
                            }}
                        >
                            Upload Leads
                        </label>
                    </div>
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
                            {sortedLeads.map((lead) => (
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
                                    <td>{lead.gender}</td>
                                    <td>{lead.status}</td>
                                    <td>{lead.source}</td>
                                    <td>{lead.leadOwner}</td>
                                    <td>{lead.assignedDate}</td>
                                    <td>{lead.assignedTo || "Not Assigned"}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleViewLead(lead)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteLead(lead.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeadList;
