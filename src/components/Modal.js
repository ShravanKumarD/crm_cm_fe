import React, { useState } from 'react';
import './Modal.css'; // Ensure to link the CSS

const LogoutModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  // When modal is open, add class to body to prevent scrolling
  document.body.classList.add('modal-open');

  const closeModal = () => {
    document.body.classList.remove('modal-open'); // Clean up the class on close
    onCancel();
  };

  return (
    < >
      <div className="modal-backdrop" onClick={closeModal} />
      <div className="modal-content">
        <h4>Are you sure you want to log out?</h4>
        <div>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;


{/* <Modal show={showModal} onHide={closeModal}>
<Modal.Header closeButton>
  <Modal.Title>Confirm Logout</Modal.Title>
</Modal.Header>
<Modal.Body>Are you sure you want to log out?</Modal.Body>
<Modal.Footer>
  <Button variant="light" onClick={closeModal}>
    Cancel
  </Button>
  <Button variant="danger" onClick={confirmLogout}>
    Log out
  </Button>
</Modal.Footer>
</Modal> */}