import React, { useState, useEffect } from 'react';
import axios from './../../components/axios'; 
import { Modal, Button, Alert } from 'react-bootstrap'; 
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

    const recordsPerPage = 20;
    const maxPageNumbers = 5;

    useEffect(() => {
       user = JSON.parse(localStorage.getItem('user'));
       setAdminId(user.id);
       fetchLeadAssignmentList(adminId);
       fetchEmployees();
       fetchLeads();
    }, [adminId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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
            const response = await axios.get(`/leadAssignment/asignedbyadmin/${user.id}`);
            setLeadAssignments(response.data.leadAssignments);
        } catch (err) {
            setError('Failed to fetch lead assignments.');
            console.error(err);
        }
    };

    const revertLeadAssigned = async (id) => {
        try {
            await axios.delete(`/leadAssignment/revertlead/${id}`);
            fetchLeadAssignmentList();
        } catch (err) {
            setError('Failed to revert lead assignment.');
            console.error(err);
        }
    };

    const revertSelectedLeads = async () => {
        try {
            for (const id of selectedLeads) {
                await axios.delete(`/leadAssignment/revertlead/${id}`);
            }
            fetchLeadAssignmentList();
            setSelectedLeads(new Set());
        } catch (err) {
            setError('Failed to revert lead assignments.');
            console.error(err);
        }
    };

    const getUserNameById = (id) => {
        const user = employees.find(emp => emp.id === id);
        return user ? user.name : 'N/A';
    };

    const getLeadNameById = (id) => {
        const lead = leads.find(lead => lead.id === id);
        return lead ? lead.name : 'N/A';
    };

    const handleNavigate = () => {
        window.location.href = "/lead-list";
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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

    const filteredAssignments = leadAssignments.filter(assignment => {
        const leadName = getLeadNameById(assignment.leadId) || '';
        const assignedToUserName = getUserNameById(assignment.assignedToUserId) || '';
        const assignedByUserName = getUserNameById(assignment.assignedByUserId) || '';

        return (
            leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignedToUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignedByUserName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredAssignments.slice(indexOfFirstRecord, indexOfLastRecord);

    const totalPages = Math.ceil(filteredAssignments.length / recordsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        if (i <= maxPageNumbers || (i > maxPageNumbers && i === totalPages) || (i >= currentPage - Math.floor(maxPageNumbers / 2) && i <= currentPage + Math.floor(maxPageNumbers / 2))) {
            pageNumbers.push(i);
        } else if (i === currentPage - Math.floor(maxPageNumbers / 2) - 1 || i === currentPage + Math.floor(maxPageNumbers / 2) + 1) {
            pageNumbers.push('...');
        }
    }

    return (
        <>
        <AdminSidebar/>
        <div className='global-container'>
            <div className="container">
                <div className="lead-assignment">
                    <h1>Lead Assignments</h1>
                 
                    {error && <div className="alert alert-danger">{error}</div>}
                    <input 
                        type="text" 
                        placeholder="Search by lead name or user name" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control mb-3"
                    />
                    
                    <button className='btn btn-primary btn-sm  ms-2' onClick={handleNavigate}>View Leads</button>
                    {/* <button className='btn btn-secondary btn-sm  ms-2' onClick={revertSelectedLeads} disabled={selectedLeads.size === 0}>Revert</button> */}
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
                            {pageNumbers.map((number, index) => (
                                <li key={index} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                                    {number === '...' ? (
                                        <span className="page-link">{number}</span>
                                    ) : (
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(number)}
                                        >
                                            {number}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <div><h2>Confirm Revert</h2></div>
                </Modal.Header>
                <Modal.Body><p>Are you sure you want to revert this lead assignment?</p></Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-primary' onClick={handleCloseModal}>
                        Cancel
                    </button>
                    <button  className='btn btn-primary' onClick={handleConfirmRevert}>
                        Revert
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
        </>
    );
}
