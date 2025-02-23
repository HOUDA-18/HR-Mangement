import React, { useState } from 'react';
import { employeeInputs } from 'formInputs';
import { useNavigate } from 'react-router-dom';
import formValidation from './formValidation';
import "./form.scss"
import axios from 'axios';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const Form = () => {
    const [valeurs, setValues]=useState({
        firstname: "",
        lastname: "",
        matricule: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [errors, setErrors]= useState({});
    const [errorsSepc, setErrorsSepc]= useState({});
    const [error, setError]=useState("");
    const navigate = useNavigate()
    
    const handleInput = (event)=>{
        setValues(prev => ({...prev, [event.target.name] : event.target.value}));
        console.log(valeurs);
    }

    const handleSubmit = (event)=>{
        event.preventDefault();

       setErrors(formValidation(valeurs)[0]);
       setErrorsSepc(formValidation(valeurs)[1])
    
        if(formValidation(valeurs)[2]==false){
                 axios.post('http://localhost:8070/api/users/register',  valeurs, {headers: {"x-access-token":localStorage.getItem("token")}}) 
                .then((res)=>{
                        navigate('/app/dashboard/employees')
                 })
                .catch((err)=>{
                    console.log("err",err);
                    setError(err.response.data)
                });

        }
    }
  return (
    <React.Fragment>
                <div className="top">
                    <h1>Add a new employee</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form action="">
                                {employeeInputs.map((input) => (
                                    <div className="formInput" key={input.id}>
                                    <label >{input.label}</label>
                                        <input 
                                            type={input.type} 
                                            name={input.name} 
                                            placeholder={input.placeholder} 
                                            className={errors[input.name]==true ? "NonValid": "Valid"} 
                                            onChange={handleInput}
                                            value={valeurs[input.name] || ""} 
                                        />
                                        {errorsSepc[input.name]!="" && (
                                            <small className="text-danger form-text">{errorsSepc[input.name]}</small>
                                        )}
                                    </div>
                                        
                                ))}
                                <div className="formButtonContainer">
                                    <button onClick={handleSubmit}>Save</button>
                                </div>
                                {error!="" && (
                                        <small className="text-danger form-text">{error}</small>
                                    )}
                        </form>
                        

                    </div>
                </div>
    </React.Fragment>
  );
};

export default Form;