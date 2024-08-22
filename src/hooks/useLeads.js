import { useContext } from 'react';
import { LeadContext } from '../context/LeadContext';

export const useLeads = () => {
    const context = useContext(LeadContext);
    if (!context) {
        throw new Error('useLeads must be used within a LeadProvider');
    }
    return context;
};
