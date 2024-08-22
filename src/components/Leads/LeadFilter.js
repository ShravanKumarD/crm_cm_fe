import React from 'react';

const LeadFilter = ({ onFilter }) => {
    const handleFilterChange = (e) => {
        onFilter(e.target.value);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Filter leads"
                onChange={handleFilterChange}
            />
        </div>
    );
};

export default LeadFilter;
