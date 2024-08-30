import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

export default function ReportPage() {
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState({
        dateRange: '',
        status: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:3000/reports', {
                    params: filter
                });
                setReports(response.data);
            } catch (err) {
                setError('Failed to fetch reports.');
                console.error(err);
            }
        };
        fetchReports();
    }, [filter]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prevFilter => ({
            ...prevFilter,
            [name]: value
        }));
    };

    const handleExport = (format) => {
        // Logic for exporting report
        console.log(`Exporting report as ${format}`);
    };

    return (
      <div className='global-container'>
        <Container className="my-5">
            <h2 className="text-center mb-4">Report Dashboard</h2>

            {error && <Alert variant='danger'>{error}</Alert>}

            <Row className="mb-4">
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="formDateRange">
                            <Form.Label>Date Range</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter date range"
                                name="dateRange"
                                value={filter.dateRange}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus" className="mt-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={filter.status}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="completed">Completed</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" className="mt-3">Apply Filters</Button>
                    </Form>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>Report Data</h4>
                        <div>
                            <Button variant="success" className="me-2" onClick={() => handleExport('pdf')}>Export as PDF</Button>
                            <Button variant="success" onClick={() => handleExport('csv')}>Export as CSV</Button>
                        </div>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map(report => (
                                    <tr key={report.id}>
                                        <td>{report.id}</td>
                                        <td>{report.name}</td>
                                        <td>{report.email}</td>
                                        <td>{report.status}</td>
                                        <td>{report.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
        </div>
    );
}
