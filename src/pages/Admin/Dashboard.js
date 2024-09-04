import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import LeadsPieChart from './../../components/PieChart';
import axios from 'axios';
import './AdminDashboard.css';
import './../../App.css'
import { Chart, ArcElement } from 'chart.js';
import TaskList from '../../components/Task/TaskList';


Chart.register(ArcElement);

const tasks = [
  {
    "id": 1,
    "title": "Task 1",
    "description": "Description of Task 1",
    "date": "2024-08-29",
    "time": "14:00",
    "children": [
      // {
      //   "id": 2,
      //   "title": "Subtask 1.1",
      //   "description": "Description of Subtask 1.1",
      //   "date": "2024-08-29",
      //   "time": "15:00",
      //   "children": [   {
      //     "id": 2,
      //     "title": "Subtask 1.1",
      //     "description": "Description of Subtask 1.1",
      //     "date": "2024-08-29",
      //     "time": "15:00",
      //     "children": [   {
      //       "id": 2,
      //       "title": "Subtask 1.1",
      //       "description": "Description of Subtask 1.1",
      //       "date": "2024-08-29",
      //       "time": "15:00",
      //       // "children": []
      //     }]
      //   }, 'b']
      // },
      // {
      //   "id": 2,
      //   "title": "Subtask 1.2",
      //   "description": "Description of Subtask 1.2",
      //   "date": "2024-08-29",
      //   "time": "15:00",
      //   // "children": []
      // }
    ]
  },
  // More tasks...
];

const AdminDashboard = () => {
  const [leadsData, setLeadsData] = useState([]);

  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const response = await fetch('http://localhost:3000/lead/');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Response:', data);
          
          const processedData = processLeadsData(data.leads); 
          setLeadsData(processedData);
        } else {
          console.error('Error: Response not OK', response.status);
        }
      } catch (error) {
        console.error('Error fetching leads data:', error);
      }
    };
    

    fetchLeadsData();
  }, []);

  const processLeadsData = (data) => {
    // Process the leads data to extract status and counts
    const statusCounts = data.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(statusCounts).map(status => ({
      status,
      count: statusCounts[status],
    }));
  };

  return (
    <div className='global-container'>
    <div className="container">
      <div className='row'>
      {/* <h2>Dashboard</h2> */}
      <div className="col-sm-4">
   
    
      <TaskList tasks={tasks} />
    </div>
    

      <div className='col-sm-2'>
      <h1>Leads</h1>
      <LeadsPieChart leadsData={leadsData} />
      </div>
    </div>
    </div>
    </div>
  );
};
export default AdminDashboard;
