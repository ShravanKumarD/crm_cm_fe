import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap'; 
import * as XLSX from 'xlsx';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import axios from './../../components/axios';

export default function Leads() {
    const [showModal, setShowModal] = useState(false);
    const [leads, setLeads] = useState([]);
    const [error, setError] = useState('');
    const [todaysLeads, setTodaysLeads] = useState(0); 
    const [totalLeads, setTotalLeads] = useState(0);

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setError(''); 
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onload = async (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            console.log(data, "excel sheet");
            const workbook = XLSX.read(data, { type: "array" });
            console.log(workbook.Sheets[0], "workbook");
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet) || {};
            console.log(jsonData[0], "jsonData");
            const importedLeads = jsonData.map((item, index) => ({
              name: Object.keys(item).find((key) =>
                key.toLowerCase().includes("name")
              )
                ? item[
                    Object.keys(item).find((key) =>
                      key.toLowerCase().includes("name")
                    )
                  ]
                : "N/A",
    
              email: Object.keys(item).find((key) =>
                key.toLowerCase().includes("email")
              )
                ? item[
                    Object.keys(item).find((key) =>
                      key.toLowerCase().includes("email")
                    )
                  ]
                : "N/A",
    
              leadSource: Object.keys(item).find((key) =>
                key.toLowerCase().includes("source")
              )
                ? item[
                    Object.keys(item).find((key) =>
                      key.toLowerCase().includes("source")
                    )
                  ]
                : "",
    
              phone: Object.keys(item).find(
                (key) =>
                  key.toLowerCase().includes("mobile") ||
                  key.toLowerCase().includes("phone")
              )
                ? item[
                    Object.keys(item).find(
                      (key) =>
                        key.toLowerCase().includes("mobile") ||
                        key.toLowerCase().includes("phone")
                    )
                  ]
                : "N/A",
              phone: item.mobile || "N/A",
              dob: item.dob || "N/A",
              company: item.company || "N/A",
              assignedDate: new Date().toISOString().split("T")[0],
              gender: item.gender || "N/A",
              city: item.city || "N/A",
              country: item.country || "N/A",
              tags: item.tags || "N/A",
              leadOwner: item.leadOwner || "N/A",
              assignedTo: item.assignedTo || "N/A",
              dateImported: new Date().toISOString(),
            }));
    
            const batchSize = 200;
            for (let i = 0; i < importedLeads.length; i += batchSize) {
              const batch = importedLeads.slice(i, i + batchSize);
    
              try {
                const response = await axios.post(`/lead/bulk`, batch);
                console.log("Leads imported successfully:", response.data);
              } catch (err) {
                console.error("Error importing leads batch:", err);
              }
            }
    
            setLeads((prevLeads) => [...prevLeads, ...importedLeads]);
          } catch (err) {
            console.error("Error processing the file:", err);
          }
        };
    
        reader.readAsArrayBuffer(file);
      };
    const handleNavigate = (path) => {
        window.location.href = path;
    };

    return (
        <>
            <AdminSidebar />
            <div className="global-container">
                <div className="container">
                    <p>&nbsp;</p>
                    <div className="page-header">
                        <h1>Manage Leads</h1>
                    </div>
                    <div className="mb-3">
                        <Button className="btn btn-primary btn-md" onClick={handleShow}>Add Leads</Button>
                        <Button className="btn btn-primary btn-md ms-2" onClick={() => handleNavigate('/lead-list')}>View Leads</Button>
                        <Button className="btn btn-primary btn-md ms-2" onClick={() => handleNavigate('/manage-leads')}>Manage Leads</Button>
                    </div>

                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <h2>Please upload Leads in the form of an Excel sheet...</h2>
                            <input
                                type="file"
                                className="form-control"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                            />
                        </Modal.Body>
                        <div className="d-flex justify-content-center">
                            <Button className="btn btn-primary" onClick={handleClose}>Close</Button>
                            <Button className="btn btn-primary" onClick={handleClose}>Save Changes</Button>
                        </div>
                    </Modal>

                    <p>&nbsp;</p>
                </div>
            </div>
        </>
    );
}
