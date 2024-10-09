import React, { useState, useEffect } from 'react';
import axios from './../../components/axios'; 
import { Modal } from 'react-bootstrap'; 
import AdminSidebar from '../../components/Sidebar/AdminSidebar';

let user;

export default function LeadManagement() {
    const [leadAssignments, setLeadAssignments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [leads, setLeads] = useState([]);
    const [error, setError] = useState(null);
    const [adminId, setAdminId] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLeads, setSelectedLeads] = useState(new Set());
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [leadToRevert, setLeadToRevert] = useState(null);
    const [filters, setFilters] = useState({
        name: "",
        date: "",
        id: "",
        status: "",
        phone: "",
        email: "",
        assignedEmployee: "",
    });
    
    const recordsPerPage = 50;
    const maxPageNumbers = 5;

    useEffect(() => {
        user = JSON.parse(localStorage.getItem('user'));
        setAdminId(user.id);
        fetchLeadAssignmentList(user.id);
        fetchEmployees();
        fetchLeads();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/user');
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employees.');
            console.error(err);
        }
    };

    const fetchLeads = async () => {
        try {
            const response = await axios.get('/lead/');
            if (response.status === 200) {
                setLeads(response.data.leads);
            }
        } catch (error) {
            setError('Error fetching leads.');
            console.error('Error fetching leads:', error.message);
        }
    };

    const fetchLeadAssignmentList = async (id) => {
        try {
            const response = await axios.get(`/leadAssignment/asignedbyadmin/${id}`);
            setLeadAssignments(response.data.leadAssignments);
        } catch (err) {
            setError('Failed to fetch lead assignments.');
            console.error(err);
        }
    };

    const revertLeadAssigned = async (id) => {
        try {
            await axios.delete(`/leadAssignment/revertlead/${id}`);
            fetchLeadAssignmentList(adminId);
        } catch (err) {
            setError('Failed to revert lead assignment.');
            console.error(err);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedLeads(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const handleRevertClick = (id) => {
        setLeadToRevert(id); 
        setShowConfirmModal(true);
    };

    const handleConfirmRevert = async () => {
        if (leadToRevert) {
            await revertLeadAssigned(leadToRevert);
            setShowConfirmModal(false); 
            setLeadToRevert(null); 
        }
    };

    const handleCloseModal = () => {
        setShowConfirmModal(false);
        setLeadToRevert(null);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const getUserNameById = (id) => {
        const user = employees.find(emp => emp.id === id);
        return user ? user.name : 'N/A';
    };

    const getLeadNameById = (id) => {
        const lead = leads.find(lead => lead.id === id);
        return lead ? lead.name : 'N/A';
    };

    const filteredAssignments = leadAssignments.filter(assignment => {
        const leadName = getLeadNameById(assignment.leadId) || '';
        const assignedToUserName = getUserNameById(assignment.assignedToUserId) || '';
        const assignedByUserName = getUserNameById(assignment.assignedByUserId) || '';
        const assignedDate = new Date(assignment.assignedDate).toLocaleDateString('en-IN');

        return (
            (leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignedToUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignedByUserName.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!filters.name || leadName.toLowerCase().includes(filters.name.toLowerCase())) &&
            (!filters.date || assignedDate === filters.date) &&
            (!filters.id || assignment.leadId.toString() === filters.id) &&
            (!filters.status || (assignment.status && assignment.status.toLowerCase().includes(filters.status.toLowerCase()))) &&
            (!filters.phone || (assignment.phone && assignment.phone.includes(filters.phone))) &&
            (!filters.email || (assignment.email && assignment.email.toLowerCase().includes(filters.email.toLowerCase()))) &&
            (!filters.assignedEmployee || assignedToUserName.toLowerCase().includes(filters.assignedEmployee.toLowerCase()))
        );
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredAssignments.slice(indexOfFirstRecord, indexOfLastRecord);

    const totalPages = Math.ceil(filteredAssignments.length / recordsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <AdminSidebar />
            <div className='global-container'>
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-md-12 mb-3">
                            <div className="filter-form row">
                                {Object.entries(filters).map(([key, value]) => (
                                    <div className="col-md-3" key={key}>
                                        <input
                                            type={key === 'date' ? 'date' : 'text'}
                                            name={key}
                                            className="form-control"
                                            placeholder={`Filter by ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                            value={value}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lead-assignment">
                        <h1>Lead Assignments</h1>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {/* <input 
                            type="text" 
                            placeholder="Search by lead name or user name" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control mb-3"
                        /> */}
                        <button className='btn btn-primary btn-sm ms-2' onClick={() => window.location.href = "/lead-list"}>View Leads</button>
                        <p>&nbsp;</p>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Lead ID</th>
                                    <th>Lead Name</th>
                                    <th>Assigned To</th>
                                    <th>Assigned By</th>
                                    <th>Assigned Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.length > 0 ? (
                                    currentRecords.map(assignment => (
                                        <tr key={assignment.id}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedLeads.has(assignment.id)}
                                                    onChange={() => handleCheckboxChange(assignment.id)}
                                                />
                                            </td>
                                            <td>{assignment.leadId}</td>
                                            <td>{getLeadNameById(assignment.leadId) || 'N/A'}</td>
                                            <td>{getUserNameById(assignment.assignedToUserId) || 'N/A'}</td>
                                            <td>{getUserNameById(assignment.assignedByUserId) || 'N/A'}</td>
                                            <td>{new Date(assignment.assignedDate).toLocaleDateString() || 'N/A'}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleRevertClick(assignment.leadId)}
                                                >
                                                    <i className="fas fa-undo me-2"></i> Revert
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <nav aria-label="Page navigation">
                            <ul className="pagination">
                                {pageNumbers.map(number => (
                                    <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => setCurrentPage(number)}
                                        >
                                            {number}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Confirmation Modal */}
                <Modal show={showConfirmModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <h2>Confirm Revert</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to revert this lead assignment?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-primary' onClick={handleCloseModal}>Cancel</button>
                        <button className='btn btn-primary' onClick={handleConfirmRevert}>Revert</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}
