import "./Modal.css"
const Modal = ({ showModal, handleClose, title, children }) => {
  return (
    <>
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{title}</h2>
                <div  className="touchable" onClick={handleClose}>
                  &times;
                </div>
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal; 