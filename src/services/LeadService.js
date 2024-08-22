// Simulated API calls for leads

export const getLeads = async () => {
    // Fetch or simulate getting leads
    return [
        { id: 1, name: 'Lead One', email: 'leadone@example.com' },
        { id: 2, name: 'Lead Two', email: 'leadtwo@example.com' }
    ];
};

export const createLead = async (lead) => {
    // Simulate creating a lead
    return { id: Date.now(), ...lead };
};

export const updateLead = async (id, lead) => {
    // Simulate updating a lead
    return { id, ...lead };
};

export const deleteLead = async (id) => {
    // Simulate deleting a lead
    return id;
};
