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

   const signin= (values)=>{

    event.preventDefault()

    axios.post("http://localhost:8070/api/users/login",  values, {
      "Access-Control-Allow-Origin": "*",
    }) 
    .then((res)=>{
       console.log("res", res)
            const user = res.data.user;
                localStorage.setItem("token",res.data.token)
                localStorage.setItem("userRole",user.role)
                localStorage.setItem("user", JSON.stringify(user))
                navigate('app/dashboard/analytics')
           
        
     })
    .catch((err)=>{
        console.log("err",err);
    })
} 
  
  return (
    <Formik
    initialValues={{
      email: 'info@codedthemes.com',
      password: '123456',
      submit: null
    }}
    validationSchema={Yup.object().shape({
      email: Yup.string().max(255).required('Email is required'),
      password: Yup.string().max(255).required('Password is required')
    })}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={()=>signin({"matricule": values.email, "password": values.password})}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              label="Email Address / Username"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
            />
            {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
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



          {errors.submit && (
            <Col sm={12}>
              <Alert>{errors.submit}</Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button className="btn-block mb-4" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                Signin
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );

};

export default JWTLogin;
