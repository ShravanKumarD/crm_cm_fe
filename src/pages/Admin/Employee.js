import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Alert } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import './Employee.css'; // Import the CSS file with custom styles
import AdminSidebar from '../../components/Sidebar/AdminSidebar';

export default function Employee() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/user');
                setEmployees(response.data);
            } catch (err) {
                setError('Failed to fetch employees.');
                console.error(err);
            }
        };
        fetchEmployees();
    }, []);

    const handleDeleteUser = async (id) => {
        try {
            const response = await axios.delete(`/user/${id}`);
            if (response.status === 200 || response.status === 204) { // Accept 200 or 204 status
                setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
            } else {
                console.error(`Failed to delete employee with id ${id}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting employee:', error.message);
        }
    };

    const handleNavigate = () => {
        window.location.href = "/employee-add";
    };

    return (
        <>
       <AdminSidebar/> 
       
        <div className='global-container'>
            <div className='container'>
                <br/>
               
                <Button className="btn btn-primary btn-md mb-4" onClick={handleNavigate}>Add Employee</Button>
                <h1>Employee List</h1>
                {error && <Alert variant='danger' className='mt-3'>{error}</Alert>}

                <div className='row'>
                    {employees.length > 0 ? (
                        employees.map(employee => (
                            <div key={employee.id} className='col-md-4 mb-4'>
                                <div className='card position-relative card-custom shadow-sm'>
                                    <p>&nbsp;</p>
                                    <Link to={`/employee-edit/${employee.id}`} className='text-decoration-none'>
                                        <button className='btn btn-primary edit-button position-absolute top-0 end-0 m-2'>
                                            <i className='fas fa-edit'></i>
                                        </button>
                                         <button 
                                        className='btn btn-primary delete-button position-absolute top-0 start-0 m-2'
                                        onClick={() => handleDeleteUser(employee.id)}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </button>
                                        <div className='card-body'>
                                            <h2>{employee.name}</h2>
                                            <p className='card-text text-muted'>{employee.email}</p>
                                            <p className='card-text'>{employee.designation}</p>
                                            <p className='card-text'>{employee.department}</p>
                                        </div>
                                    </Link>
                                   
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No employees found.</p>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}
