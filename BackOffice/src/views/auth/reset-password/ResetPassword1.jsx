import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// assets
import logoDark from '../../../assets/images/logo-dark.png';
import axios from 'axios';

// ==============================|| RESET PASSWORD 1 ||============================== //

const ResetPassword1 = () => {

  const [email, setEmail]=useState("")
  const [inputError, setInputError]=useState("")
  const [error, setError]=useState("")

  const handleSubmit=async ()=>{
      if(email!=""){
        setInputError("")
          try {
            await axios.post("http://localhost:8070/api/users/forget-password", {"email" :email})
          } catch (error) {
            console.log(error)
            setError(error)
          }
      }else{
        setInputError("Email Required")
      }
  }
  const handleOnChange= (event)=>{
      setEmail(event.target.value)
      console.log(event.target.value)
  }
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content text-center">
          <Card className="login-card borderless">
            <Row className="align-items-center text-center">
              <Col>
                <Card.Body className="card-body">
                  <i className='feather icon-lock auth-icon' />
                  <h4 className="mb-3 f-w-400">Reset your password</h4>
                  <div className="input-group mb-4 d-flex flex-column">
                    <input type="email" className="form-control w-100" placeholder="Email address" onChange={handleOnChange}/>
                    {inputError!="" && (
                      <>
                      <small className="text-danger form-text">{inputError}</small>
                      </>
                      
                        )}
                  </div>
                  
                  <button className="btn btn-block btn-primary mb-4" onClick={()=>handleSubmit()}>Reset password</button>
                  <p className="mb-0 text-muted">
                    Return to signin{' '}
                    <NavLink to="/auth/signin-1" className="f-w-400">
                      Signin
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResetPassword1;
