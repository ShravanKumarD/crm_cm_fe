import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import ManagerSidebar from './ManagerSidebar';
import EmployeeSidebar from './EmployeeSidebar';

const Sidebar = () => {
    const { role } = useAuth();

    if (role === 'admin') {
        return <AdminSidebar />;
    } else if (role === 'manager') {
        return <ManagerSidebar />;
    } else if (role === 'employee') {
        return <EmployeeSidebar />;
    } else {
        return null; // or a default/fallback sidebar
    }
};

export default Sidebar;
