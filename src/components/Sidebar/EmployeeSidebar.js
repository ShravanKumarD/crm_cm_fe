import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function EmployeeSidebar() {
  return (
    <aside className="main-sidebar elevation-4 fixed">
    <div className="sidebar">
      <a href="# " className="brand-link">
        <span className="brand-text font-weight-light ">
          <strong>Employee</strong>
        </span>
      </a>
      <div className="sidebar-scroll">
      <nav className="mt-2">
        <ul
          className="nav nav-pills nav-sidebar flex-column"
          role="menu"
          data-accordion="false"
        >
          <li className="nav-item">
            <NavLink
              to="/employee-dashboard"
              className="nav-link"
              activeClassName="active"
            >
              <i className="nav-icon fas fa-tachometer-alt" />
              <p>Dashboard</p>
            </NavLink>
          </li>
          <li className="nav-item has-treeview">
            <NavLink
              to="/emp-leads"
              className="nav-link"  
              activeClassName="active"
            >
              <i className="nav-icon fa fa-rocket" />
              <p>
                Leads
                {/* <i className="right fas fa-angle-down" /> */}
              </p>
            </NavLink>
          </li>
          {/* <li className="nav-item has-treeview">
              <NavLink
                to="/employee"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-users" />
                <p>
                  Employees
                </p>
              </NavLink>
            </li> */}
          <li className="nav-item">
            <NavLink
              to="/employee-settings"
              className="nav-link"
              activeClassName="active"
            >
              <i className="nav-icon fa fa-cog" />
              <p>Settings</p>
            </NavLink>
          </li>
          {/* <li className="nav-item">
              <NavLink
                to="/reports"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-chart-bar" />
                <p>Reports</p>
              </NavLink>
            </li> */}
        </ul>
      </nav>
      </div>
    </div>
  </aside>
  )
}
