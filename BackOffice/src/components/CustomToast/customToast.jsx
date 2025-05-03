import React, { useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import { CiCircleCheck } from "react-icons/ci";
import { FaExclamationTriangle } from "react-icons/fa";

import './toast.scss'; // optional for styling

const CustomToast = ({  type, message, setShowToast }) => {
  useEffect(() => {
    setTimeout(() => {
        setShowToast(false);
        console.log('message: ', message)
      }, 3000);
  }, []);

  const icons = {
    success: <CiCircleCheck className={`toast-icon ${type}`} />,
    warning: <FaExclamationTriangle className={`toast-icon ${type}`} />,
  };


  return (
    <div className="toast-wrapper">
      <Toast  className={`toast ${type}`}   onClose={()=>setShowToast(false)}>
        <Toast.Header className={`toast-header-custom ${type}`} closeButton={false}>
              {icons[type]}
          <strong className="toast-title">
                {type === "success" ? "Success" : "Warning"}
          </strong>
        </Toast.Header>
        <Toast.Body className="toast-message">{message}</Toast.Body>
      </Toast>
    </div>
  );
};

export default CustomToast;
