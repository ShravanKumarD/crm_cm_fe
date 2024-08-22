import React, { createContext, useState } from 'react';

export const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
    const [leads, setLeads] = useState([]);

    return (
        <LeadContext.Provider value={{ leads, setLeads }}>
            {children}
        </LeadContext.Provider>
    );
};
