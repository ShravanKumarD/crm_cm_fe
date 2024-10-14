import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from './../../components/axios'; 
import "./LeadList.css";
import "./../../App.css";
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import ManagerSidebar from '../../components/Sidebar/ManagerSidebar';

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
            const response = await axios.get('/lead');
            if (response.status === 200) {
                setLeads(response.data.leads.map(lead => ({
                    ...lead,
                    assignedTo: lead.assignedTo || "Not Assigned"
                })));
            }
        } catch (error) {
            console.error('Error fetching leads:', error.message);
        }
    };
    
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/user');
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employees.');
            console.error(err);
        }
    };

    const handleDeleteLead = async (id) => {
        try {
            const response = await axios.delete(`/${id}`);
            if (response.status === 200) {
                setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
            } else {
                console.error(`Failed to delete lead with id ${id}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting lead:', error.message);
        }
    };
    const handleAssignLeads = async (assignedTo) => {
        if (selectedLeads.length === 0) {
          alert("Please select leads to assign.");
          return;
        }
        if (!assignedTo) {
          console.error("No user selected for assignment.");
          return;
        }
      
        const confirmed = window.confirm(
          `Are you sure you want to assign the selected leads to this user?`
        );
        if (!confirmed) {
          return;
        }
      
        let token = localStorage.getItem("token");
        let user;
        const decodedToken = jwtDecode(token);
        user = decodedToken.user;
      
        try {
          const updateLeadIds = Array.isArray(selectedLeads) ? selectedLeads : [selectedLeads];
          const [assignResponse, leadUpdateResponse] = await Promise.all([
            axios.post("/leadAssignment/assign", {
              leadIds: updateLeadIds,
              assignedToUserId: assignedTo,
              assignedBy: user.id,
            }),
            // axios.put("/lead/updateLeads", {
            //   leadIds: updateLeadIds,
            //   assignedTo: assignedTo,
            // }),
          ]);   
           console.log(assignResponse, leadUpdateResponse,"assignResponse, leadUpdateResponse")
          if (assignResponse.status === 200 || leadUpdateResponse.status === 200) {
            setLeads((prevLeads) =>
              prevLeads.map((lead) =>
                selectedLeads.includes(lead.id)
                  ? { ...lead, assignedTo: assignResponse.data.assignedTo.name }
                  : lead
              )
            );
            setSelectedLeads([]);
          } else {
            console.error(
              "Failed to assign leads:",
              assignResponse.data.error || "Unknown error"
            );
          }
        } catch (error) {
          console.error("Error assigning leads:", error.message || "Unknown error");
        }
      };
      


  
    const handleFileUpload = async(e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload =async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
               
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                console.log(jsonData,"josnDatas")
                const importedLeads = jsonData.map((item, index) => ({
                    id: leads.length + index + 1, // Generate a unique ID
                    name: item.name || item.Name || item.firstname + item.lastname || 'N/A',
                    email: item.email || item.Email || 'N/A',
                    status: item.status || item.Status || 'N/A',
                    leadSource: item.source || item.Source || item.leadSource||item.source|| item.leadSource || item.LeadSource ||'N/A',
                    phone: item.mobile || item.Mobile  || 'N/A',
                    dob: item.dob || item.dateOfBirth || item.dateofBirth || 'N/A',
                    company: item.company || item.organization || item.firm || 'N/A',
                    assignedDate: item.AssignedDate || item.Date || new Date().toISOString().split('T')[0] || 'N/A',
                    gender: item.Gender || item.gender || 'N/A',
                    city: item.city || item.City || 'N/A',
                    country: item.country || item.Country || 'N/A',
                    tags: item.tags || item.Tags || item.tag || 'N/A',
                    leadOwner: item.leadOwner || item.LeadOwner || 'N/A',
                    assignedTo: item.assignedTo || 'N/A',
                    dateImported: item.dateImported || new Date().toISOString(),
                }));
                console.log(importedLeads,"importedLeads")
               await axios.post(`/lead/bulk`, importedLeads)
                .then(response => {
                    console.log(response.data);
                    console.log('Leads imported successfully:', response.data);
                })
                .catch(err => {
                    console.error('Error importing leads:', err);
                });
                setLeads(prevLeads => [...prevLeads, ...importedLeads]);
            } catch (err) {
                console.error('Error processing the file:', err);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleViewLead = (lead) => {
        navigate('/manager-lead-details', { state: { lead } });
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
  
    const filteredLeads = leads.filter(lead => {
        const formattedDate = lead.dateImported ? moment(lead.dateImported).format('YYYY-MM-DD') : '';
        return (
            (filters.name ? lead.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
            (filters.date ? formattedDate === filters.date : true) &&
            (filters.id ? lead.id.toString() === filters.id : true) &&
            (filters.status ? lead.status.toLowerCase().includes(filters.status.toLowerCase()) : true) &&
            (filters.phone ? lead.phone.includes(filters.phone) : true) &&
            (filters.email ? lead.email.toLowerCase().includes(filters.email.toLowerCase()) : true)
        );
    });
    const sortLeads = (leadsList) => {
        return leadsList.sort((a, b) => {
            const statusA = a.status ? a.status.toLowerCase() : '';
            const statusB = b.status ? b.status.toLowerCase() : '';
    
            // Compare statuses
            if (statusA === 'inactive' && statusB !== 'inactive') {
                return 1;
            }
            if (statusA !== 'inactive' && statusB === 'inactive') {
                return -1;
            }
            return 0;
        });
    };
    

    const sortedLeads = sortLeads(filteredLeads);

    return (
        <>
        <ManagerSidebar/>
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
                            <p>&nbsp;</p>
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
                                <input
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder="Filter by Email"
                                    value={filters.email}
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
                                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                                ))}
                            </select>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleRevertAssignments}
                                disabled={selectedLeads.length === 0}
                            >
                                Revert
                            </button>
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
                                <th>Lead Id.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>Status</th>
                                <th>Lead Source</th>
                                {/* <th>Lead Owner</th> */}
                                <th>Imported On</th>
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
                                    <td>{lead.leadSource ||lead.Source || "NA"}</td>
                                    {/* <td>{lead.leadOwner}</td> */}
                                 <td>{moment(lead.dateImported).format(" DD MMM, YYYY    ")}</td>
                                    <td>{lead.assignedTo || "Not Assigned"}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleViewLead(lead)}
                                        >
                                           <i className='fa fa-eye'/>
                                        </button>
                                        {/* <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteLead(lead.id)}
                                        >
                                            Delete
                                        </button> */}
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
