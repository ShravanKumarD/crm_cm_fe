// Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import NewPasswordModal from './../components/NewPassword';
import './Header.css'; 

const Header = () => {
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCompleted(true);
  };

  const handleNewPassword = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  if (completed) {
    navigate('/login'); // Redirect to the login page using navigate
    return null; // Ensure nothing is rendered while redirecting
  }

  return (
    <nav className="header navbar navbar-expand navbar-white navbar-light">
      {/* Include the modal */}
      <NewPasswordModal show={showModal} onHide={closeModal} />
      
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" id="userDropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-user" />
            
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right" aria-labelledby="userDropdown">
            <span className="dropdown-header">Options</span>
            <div className="dropdown-divider" />
            <a onClick={handleNewPassword} href="#" className="dropdown-item" role="menuitem">
              <i className="fas fa-key mr-2" /> Change Password
            </a>
            <div className="dropdown-divider" />
            <span className="pl-1">
              {/* Replace 'user' with actual user data */}
              {/* {JSON.parse(localStorage.getItem('user')).fullname} */}
              user
            </span>
            <a onClick={handleLogout} href="#" className="dropdown-item" role="menuitem">
              <i className="fas fa-sign-out-alt mr-2" /> Log out
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
