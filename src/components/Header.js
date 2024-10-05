import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './Header.css';

const Header = () => {
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCompleted(true);
  };

  const closeModal = () => setShowModal(false);

  if (completed) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <nav className="header navbar navbar-expand navbar-white navbar-light">
        <div className="container-fluid">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a
                className="nav-link logout-link"
                href="#"
                role="button"
                onClick={handleLogout}
              >
                <i className="nav-icon fas fa-sign-out-alt" style={{ marginRight: '5px' }} />
                <span className="pl-1">Log out</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <div><h2>Confirm Logout</h2></div>
        </Modal.Header>
        <Modal.Body><p>Are you sure you want to log out?</p></Modal.Body>
        <Modal.Footer>
          <button className='btn btn-primary' onClick={closeModal}>
            Cancel
          </button>
          <button className='btn btn-primary' onClick={confirmLogout}>
            Log out
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
