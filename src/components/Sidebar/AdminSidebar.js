import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "./../../assets/samcint_logo_2.png"

const AdminSidebar = ({}) => {
  // const [employee, setEmployee] = useState(null); 
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

// useEffect(() => {
  //   if (user && user.id) {  
  //     fetchEmployee();
  //   } else {
  //     setError('User not found. Please log in.');
  //   }
  // }, [user]);

  // const fetchEmployee = async () => {
  //   try {
  //     const response = await axios.get(`/user/${user.id}`);
  //     setEmployee(response.data);
  //   } catch (err) {
  //     setError('Failed to fetch employee data.');
  //     console.error(err);
  //   }
  // };

  return (
    <aside className="main-sidebar elevation-4 fixed">
      <div className="sidebar">
        <img className="brand-image" src={logo} alt="Logo" />
        <h2 className="brand-text font-weight-light">
          <i className="nav-icon fas fa-user" style={{ margin: '5px', color: "#6c24248c" }} />
          {user ? user.name.split(' ')[0] : error || "Guest"}
        </h2>
        <div className="sidebar-scroll">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" role="menu" data-accordion="false">
              <li className="nav-item">
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
                >
                  <i className="nav-icon fas fa-tachometer-alt" style={{ marginRight: "8px" }} />
                  <p style={{ margin: 0 }}>Dashboard</p>
                </NavLink>
              </li>

              <li className="nav-item has-treeview">
                <NavLink
                  to="/Leads"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
                >
                  <i className="nav-icon fa fa-rocket" style={{ marginRight: "8px" }} />
                  <p>Leads</p>
                </NavLink>
              </li>
              
              <li className="nav-item has-treeview">
                <NavLink
                  to="/employee"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
                >
                  <i className="nav-icon fa fa-users" style={{ marginRight: "8px" }} />
                  <p>Employees</p>
                </NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink
                  to="/settings"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
                >
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
};

export default AdminSidebar;
