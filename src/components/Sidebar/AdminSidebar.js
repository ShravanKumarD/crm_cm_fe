import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const AdminSidebar = ({ user, userId }) => {
  return (
    <aside className="main-sidebar elevation-4 fixed">
      <div className="sidebar">
        <a href="/" className="brand-link">
          <span className="brand-text font-weight-light">
            <strong>ADMIN</strong>
          </span>
        </a>
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className="nav-item has-treeview">
              <NavLink
                to="/Leads"
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
            <li className="nav-item has-treeview">
              <NavLink
                to="/employee"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-users" />
                <p>
                  Employees
                  {/* <i className="" /> */}
                </p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/settings"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-cog" />
                <p>Settings</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/reports"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-chart-bar" />
                <p>Reports</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
