import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Alert } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';

export default function Employee() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user');
                setEmployees(response.data);
            } catch (err) {
                setError('Failed to fetch employees.');
                console.error(err);
            }
        };
        fetchEmployees();
    }, []);

    const handleNavigate = () => {
        window.location.href = "/employee-add";
    };

    return (
        <div className='global-container'>
            <div className='container'>
                <h1>Employee List</h1>
                <Button className="btn btn-primary btn-lg" onClick={handleNavigate}>Add Employee</Button>
                {/* <Button className='btn btn-info btn-lg ms-2' onClick={handleNavigate}>View Employees</Button> */}

                {error && <Alert variant='danger' className='mt-3'>{error}</Alert>}

                <div className='row mt-4'>
                    {employees.length > 0 ? (
                        employees.map(employee => (
                            <div key={employee.id} className='col-md-4 mb-4'>
                                <div className='card position-relative'>
                                    <Link to={`/employee-edit/${employee.id}`} className='text-decoration-none'>
                                        <button className='btn btn-warning edit-button position-absolute top-0 end-0 m-2'>
                                            <i className='fas fa-edit'></i> Edit
                                        </button>
                                        <img 
                                            src={`https://images.generated.photos/UYdk4oblUnCyHqZrIA1IAT33aMM2h28npFZ20fpxYl8/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/OTUzOTM5LmpwZw.jpg`} 
                                            className='card-img-top' 
                                            alt={`${employee.name}'s avatar`} 
                                        />
                                        <div className='card-body'>
                                            <h5 className='card-title'>{employee.name}</h5>
                                            <p className='card-text'>{employee.email}</p>
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
    );
}
