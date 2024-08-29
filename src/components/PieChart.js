import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './pie.css';

Chart.register(ArcElement, Tooltip, Legend);

const LeadsPieChart = ({ leadsData }) => {
  const chartData = {
    labels: leadsData.map(lead => lead.status), 
    className:"pie",
    datasets: [
      {
        label: 'Leads',
        data: leadsData.map(lead => lead.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-container">
       <h1>Leads</h1>
      <Pie data={chartData} options={options} className='pie'/>
    </div>
  );
};

export default LeadsPieChart;
