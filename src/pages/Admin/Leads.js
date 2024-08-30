import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap'; 
import * as XLSX from 'xlsx';

export default function Leads() {
    const [showModal, setShowModal] = useState(false);
    const [leads, setLeads] = useState([]);
    const [error, setError] = useState('');

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setError(''); // Clear error when modal is closed
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError('No file selected.');
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const importedLeads = jsonData.map((item) => ({
                    name: item.name || item.Name || `${item.firstname || ''} ${item.lastname || ''}`.trim() || 'N/A',
                    email: item.email || item.Email || 'N/A',
                    status: item.status || item.Status || 'N/A',
                    source: item.source || item.Source || 'N/A',
                    phone: item.mobile || item.Mobile || 'N/A',
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

                // Post data to backend
                postData(importedLeads);
            } catch (err) {
                setError('Error processing the file. Please make sure it is a valid Excel file.');
                console.error('Error reading file:', err);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleNavigate = () => {
        window.location.href = "/lead-list";
    };
    const handleNavigateManagement = () => {
        window.location.href = "/manage-leads";
    };


    const postData = async (data) => {
        try {
            const response = await fetch('http://localhost:3000/lead/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to post data.');
            }

            console.log('Data successfully posted');
        } catch (error) {
            setError(error.message || 'An error occurred while posting data.');
            console.error('Error posting data:', error);
        }
    };

    return (
        <div className="global-container">
            <div className='container'>
                <div className="page-header">
                    <h1>Leads</h1>
                </div>
                <div className='mb-3'>
                    <Button className="btn btn-primary btn-lg" onClick={handleShow}>Add Leads</Button>
                    <Button className='btn btn-info btn-lg ms-2' onClick={handleNavigate}>View Leads</Button>
                    <Button className='btn btn-danger btn-lg ms-2' onClick={handleNavigateManagement}>Manage Leads</Button>
                </div>


                {/* Modal */}
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Leads</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <p>Please upload Leads in the form of an Excel sheet...</p>
                        <input
                            type="file"
                            className="form-control"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
