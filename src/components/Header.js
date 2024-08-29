import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './Header.css'; // Ensure the path is correct
// import NewPasswordModal from '../components/NewPasswordModal'; // Uncomment if using the modal

const Header = () => {
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    return <Navigate to="/login" />;
  }

  return (
    <nav className="header navbar navbar-expand navbar-white navbar-light">
      {/* Uncomment the following line if you want to display the modal */}
      {/* {showModal && <NewPasswordModal show={showModal} onHide={closeModal} />} */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a className="nav-link" href="/login" role="button" data-toggle="dropdown">
            <i className="fas fa-user" />
            <span className="pl-1">
              {/* Replace 'user' with actual user data */}
              {/* {JSON.parse(localStorage.getItem('user')).fullname} */}
              user
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span className="dropdown-header">Options</span>
            <div className="dropdown-divider" />
            <a onClick={handleNewPassword} href="#" className="dropdown-item" role="menuitem">
              <i className="fas fa-key mr-2" /> Change Password
            </a>
            <div className="dropdown-divider" />
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
