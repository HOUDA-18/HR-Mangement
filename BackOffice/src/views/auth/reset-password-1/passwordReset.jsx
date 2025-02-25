import React, { useState } from 'react';

// react-bootstrap
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { NavLink, useParams } from 'react-router-dom';

// react-bootstrap
import { Card } from 'react-bootstrap';

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ==============================|| JWT LOGIN ||============================== //

const PasswordReset = () => {
  
  const navigate= useNavigate()
  const [passwordError, setPasswordError]=useState(false)
  const [errors, setErrors]= useState({})
  const params= useParams()
  const handleReset= async(values)=>{
    event.preventDefault();
    if(values.password!="" && values.password_confirmation!=""){
      if(values.password === values.password_confirmation){
          try {
            await axios.post(`http://localhost:8070/api/users/reset-password/${params.token}`, {"password":values.password})
            navigate('/auth/signin-1')
          } catch (error) {
            console.log("error: ", error)
            setErrors(error)
          }
      }else{
        setPasswordError(true)
      }
    }

  }
  
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content text-center">
          <Card className="borderless">
            <Row className="align-items-center text-center">
              <Col>
                <Card.Body className="card-body">
                <i className='feather icon-lock auth-icon' />
                <h4 className="mb-3 f-w-400">Provide a new password</h4>
                <Formik
    initialValues={{
      password_confirmation: '',
      password: '',
      submit: null
    }}
    validationSchema={Yup.object().shape({
      password_confirmation: Yup.string().min(3).max(255).required('password_confirmation is required'),
      password: Yup.string().min(3).max(255).required('Password is required'),

    })}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        
        <form noValidate onSubmit={()=>handleReset({"password_confirmation": values.password_confirmation, "password": values.password})}>
          
          <div className="form-group mb-4">
            <input
              className="form-control"
              label="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              placeholder='Enter new password'
              value={values.password}
            />
            {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
          </div>
          <div className="form-group mb-3">
            <input
              className="form-control"
              label="password_confirmation"
              name="password_confirmation"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              placeholder='Confirm new password'
              value={values.password_confirmation}
            />
            {touched.password_confirmation && errors.password_confirmation && <small className="text-danger form-text">{errors.password_confirmation}</small>}
            {passwordError && (
            <small className="text-danger form-text">Password and Password confirmation doesn't match</small>
          )}
          </div>



          

          <Row>
            <Col mt={2}>
              <Button className="btn-block mb-4" color="primary" disabled={errors.password || errors.password_confirmation} size="large" type="submit" variant="primary">
                Reset
              </Button>
            </Col>
          </Row>

          {errors!={} && (
            <small className="text-danger form-text">{errors.message}</small>
          )}
        </form>
      )}
    </Formik>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>

  );

};

export default PasswordReset;
