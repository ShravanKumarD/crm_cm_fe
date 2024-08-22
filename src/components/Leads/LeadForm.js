import React, { useState } from 'react';

const LeadForm = ({ onSave }) => {
    const [lead, setLead] = useState({ name: '', email: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLead({ ...lead, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(lead);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={lead.name}
                onChange={handleChange}
                placeholder="Name"
            />
            <input
                type="email"
                name="email"
                value={lead.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <button type="submit">Save Lead</button>
        </form>
    );
};

export default LeadForm;
