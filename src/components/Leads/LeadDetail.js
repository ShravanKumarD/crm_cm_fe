import React from 'react';

const LeadDetail = ({ lead }) => {
    if (!lead) return <div>Select a lead to see details</div>;

    return (
        <div>
            <h2>Lead Details</h2>
            <p>Name: {lead.name}</p>
            <p>Email: {lead.email}</p>
            {/* Add more lead details here */}
        </div>
    );
};

export default LeadDetail;
