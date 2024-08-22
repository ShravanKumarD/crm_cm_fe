import React from 'react';
import LeadList from '../components/Leads/LeadList';
import LeadForm from '../components/Leads/LeadForm';
import LeadFilter from '../components/Leads/LeadFilter';

const LeadsPage = () => {
    return (
        <div>
            <h1>Leads Page</h1>
            <LeadFilter onFilter={() => {}} />
            <LeadForm onSave={() => {}} />
            <LeadList />
        </div>
    );
};

export default LeadsPage;
