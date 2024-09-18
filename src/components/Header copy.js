import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './Header.css';
import axios from 'axios';

const Header = () => {
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [employee,setEmployee]=useState('')
  const [error,setError]=useState('')

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
        {/* <li className="nav-item">
          <a className="nav-link" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li> */}
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a className="nav-link" href="/login" role="button" data-toggle="dropdown">
          <i className="nav-icon fas fa-sign-out-alt" style={{ marginRight: '5px' }} />
            <span className="pl-1">
             Log out
            </span>
          </a>
         
        </li>
      </ul>
    </nav>
  );
};

export default Header;