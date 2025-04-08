import React from 'react';
import './confirmationAlert.scss';

const ConfirmationAlert = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-overlay">
      {message==="loading..."? 
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      :      
        <div className="confirmation-alert">
            <p>{message}</p>
            <div className="confirmation-buttons">
              <button onClick={onConfirm} className="confirm-button">Confirm</button>
              <button onClick={onCancel} className="cancel-button">Cancel</button>
            </div>
         </div>
      }

    </div>
  );
};

export default ConfirmationAlert;