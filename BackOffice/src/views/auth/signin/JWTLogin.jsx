import React from 'react';

// react-bootstrap
import { Row, Col, Alert, Button } from 'react-bootstrap';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useLogin } from '../../../hooks/useLogin';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ==============================|| JWT LOGIN ||============================== //

const JWTLogin = () => {
  
  const navigate= useNavigate()
  let {signin, userError} = useLogin({})
  const handleSignin= (values)=>{
    event.preventDefault();
    signin(values)
  }
  
  return (
    <Formik
    initialValues={{
      matricule: '',
      password: '',
      submit: null
    }}
    validationSchema={Yup.object().shape({
      matricule: Yup.string().min(3).max(255).required('Matricule is required'),
      password: Yup.string().min(3).max(255).required('Password is required'),

    })}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        
        <form noValidate onSubmit={()=>handleSignin({"matricule": values.matricule, "password": values.password})}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              label="Matricule"
              name="matricule"
              onBlur={handleBlur}
              onChange={handleChange}
              type="matricule"
              value={values.matricule}
            />
            {touched.matricule && errors.matricule && <small className="text-danger form-text">{errors.matricule}</small>}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              label="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
          </div>



          

          <Row>
            <Col mt={2}>
              <Button className="btn-block mb-4" color="primary" disabled={errors.password || errors.matricule} size="large" type="submit" variant="primary">
                Signin
              </Button>
            </Col>
          </Row>

          {userError && (
            <small className="text-danger form-text">{userError}</small>
          )}
        </form>
      )}
    </Formik>
  );

};

export default JWTLogin;
