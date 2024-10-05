import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function EmployeeSidebar() {
  const [employee, setEmployee] = useState(null); 
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`/user/${user.id}`);
        setEmployee(response.data);
      } catch (err) {
        setError('Failed to fetch employee data.');
        console.error(err);
      }
    };

    if (user && user.id) {
      fetchEmployees();
    } else {
      setError('User not autherized.');
    }
  }, [user]);

  return (
    <aside className="main-sidebar elevation-4 fixed">
      <div className="sidebar">
        {/* <a  className="brand-link"> */}
          <h2 className="brand-text font-weight-light">
            <i className="nav-icon fas fa-user" style={{margin:'5px'}}/>
            {employee ? employee.name.split(' ')[0] : "Loading..."}
          </h2>
        {/* </a> */}
        <div className="sidebar-scroll">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" role="menu" data-accordion="false">
              <li className="nav-item">
                <NavLink to="/employee-dashboard" className="nav-link" activeClassName="active" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <i className="nav-icon fas fa-tachometer-alt" style={{ marginRight: "8px" }} />
                  <p style={{ margin: 0 }}>Dashboard</p>
                </NavLink>
              </li>

              {/* Leads Link */}
              <li className="nav-item has-treeview">
                <NavLink to="/emp-leads" className="nav-link" activeClassName="active" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <i className="nav-icon fas fa-rocket" style={{ marginRight: "8px" }} />
                  <p>Leads</p>
                </NavLink>
              </li>

              {/* Walkins */}
              <li className="nav-item has-treeview">
                <NavLink to="/walkins-list" className="nav-link" activeClassName="active" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <i className="nav-icon fas fa-person-walking" style={{ marginRight: "8px" }} />
                  <p>Walkins</p>
                </NavLink>
              </li>

              {/* Settings Link */}
              <li className="nav-item">
                <NavLink to="/employee-settings" className="nav-link" activeClassName="active" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <i className="nav-icon fa fa-cog" style={{ marginRight: "8px" }} />
                  <p>Settings</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}
