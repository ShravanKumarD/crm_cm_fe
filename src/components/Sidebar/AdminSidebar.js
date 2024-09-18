import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const AdminSidebar = () => {
  const [employee,setEmployee]=useState('')
  const [error,setError]=useState('')
  let user = JSON.parse(localStorage.getItem('user'))


  useEffect(()=>{
    fetchEmployees();
  },[])
  const fetchEmployees = async () => {
    try {
        const response = await axios .get(`http://localhost:3000/user/${user.id}`);
        setEmployee(response.data);
        console.log(employee,'user')
    } catch (err) {
        setError('Failed to fetch employees.');
        console.error(err);
    }
};

  return (
    <aside className="main-sidebar elevation-4 fixed">
      <div className="sidebar">
      <a href="# " className="brand-link">
          <span className="brand-text font-weight-light">
          <i className="nav-icon fas fa-user"
          style={{padding:"4.5px"}}
/>
            {employee.name}
          </span>
        </a>
        {/* Scrollable content */}
        <div className="sidebar-scroll">
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              role="menu"
              data-accordion="false"
            >
                <li className="nav-item">
                <NavLink
                  to="/admin-dashboard"
                  className="nav-link"
                  activeClassName="active"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <i
                    className="nav-icon fas fa-tachometer-alt"
                    style={{ marginRight: "8px" }}
                  />
                  <p style={{ margin: 0 }}>Dashboard</p>
                </NavLink>
              </li>

              <li className="nav-item has-treeview">
                <NavLink
                  to="/Leads"
                  className="nav-link"
                  activeClassName="active"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <i className="nav-icon fa fa-rocket" style={{ marginRight: "8px" }} />
                  <p>
                    Leads
                  </p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/employee"
                  className="nav-link"
                  activeClassName="active"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <i className="nav-icon fa fa-users"    style={{ marginRight: "8px" }} />
                  <p>
                    Employees
                  </p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/settings"
                  className="nav-link"
                  activeClassName="active"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <i className="nav-icon fa fa-cog"    style={{ marginRight: "8px" }}/>
                  <p>Settings</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/reports"
                  className="nav-link"
                  activeClassName="active"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <i className="nav-icon fa fa-chart-bar"   style={{ marginRight: "8px" }} />
                  <p>Reports</p>
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
