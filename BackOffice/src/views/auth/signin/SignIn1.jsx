import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Use `useNavigate` for React Router v6
import { Card, Button, Alert } from 'react-bootstrap';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import AuthLogin from './JWTLogin';
import loginIcon from "../../../assets/images/icons8-conference-94.png";

// ==============================|| SIGN IN 1 ||============================== //

const Signin1 = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use `useNavigate` from React Router v6

  const handleLoginSuccess = (response) => {
    if (response.success) {
      // Redirect to the verification page on success
      navigate('/verify-account'); // Redirect to the 2FA verification page
    } else {
      setError(response.message);
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="login-card borderless text-center login-card">
            <Card.Body>
            <img src={loginIcon} alt="Login Logo" className="login-logo" />
            <h4 className="mb-4">Sign In</h4>
              
              <AuthLogin onLoginSuccess={handleLoginSuccess} />
              {error && <Alert variant="danger">{error}</Alert>}
              <p className="mb-2 text-muted">
                Forgot password?{' '}
                <NavLink to={'/auth/reset-password-1'} className="f-w-400">
                  Reset
                </NavLink>
              </p>
              <p className="mb-2 text-muted">
                login in another way?{' '}
                <NavLink to={'/auth/face-login'} className="f-w-400">
                  use facial recognition
                </NavLink>
              </p>
              <p className="mb-2 text-muted">
                signup in another way?{' '}
                <NavLink to={'/auth/face-signup'} className="f-w-400">
                  use facial recognition
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
