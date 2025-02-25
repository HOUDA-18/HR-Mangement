import React from "react";
import { NavLink } from "react-router-dom";

// React Bootstrap
import { Card } from "react-bootstrap";

// Project imports
import Breadcrumb from "../../../layouts/AdminLayout/Breadcrumb";
import AuthLogin from "./JWTLogin";

// Assets
import logoDark from "../../../assets/images/logo-dark.png";
import loginIcon from "../../../assets/images/icons8-conference-94.png"; // Import the uploaded logo

const Signin1 = () => {
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-background"></div> {/* Background on the left */}
        <div className="auth-content">
          <Card className="login-card borderless text-center login-card">
            <Card.Body>
              <img src={loginIcon} alt="Login Logo" className="login-logo" />
              <h4 className="mb-4">Sign In</h4>
              <AuthLogin />
              <p className="mb-2 text-muted">
                Forgot password?{" "}
                <NavLink to={"/auth/reset-password-1"} className="f-w-400">
                  Reset
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
