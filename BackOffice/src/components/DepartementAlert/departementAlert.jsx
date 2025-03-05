import React, { useState } from 'react';
import './departementAlert.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import formValidation from './formValidator';


const DepartementAlert = ({data, onCancel, onConfirm, type }) => {
    const [values, setValues]=useState(data)
    const [errors, setErrors]= useState({});
    const [errorsSepc, setErrorsSepc]= useState({});
    const [error, setError]=useState("");
    const navigate = useNavigate()

    
    const handleInput = (event)=>{
        setValues(prev => ({...prev, [event.target.name] : event.target.value}));
    }

    const handleConfirm= (event)=>{
        console.log(data)
        setErrorsSepc(formValidation(values)[0])
        console.log("errSpec", formValidation(values)[0])
     
         if(formValidation(values)[1]==false){
            if(type==="add"){
                axios.post('http://localhost:8070/api/departements',  values) 
                .then((res)=>{
                       onConfirm()
                       window.location.reload();
                 })
                .catch((err)=>{
                    console.log("err",err);
                    setError(err.response.data)
                });
            }else if(type==="update"){
                axios.put(`http://localhost:8070/api/departements/${data._id}`,  values) 
                .then((res)=>{
                        onConfirm()
                        window.location.reload();
                 })
                .catch((err)=>{
                    console.log("err",err);
                    setError(err.response.data.type[0])
                });
            }

 
         }



    }
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-alert">
        <div className="field">
            <label >Code: </label>
            <input name='code' type="text" value={values.code || ""} placeholder='Enter departement code' onChange={handleInput}/>
            {errorsSepc.code!="" && (
                                            <small className="text-danger form-text">{errorsSepc.code}</small>
                                        )}
        </div>
        <div className="field">
            <label >Name: </label>
            <input name='name' type="text" value={values.name || ""} placeholder='Enter departement name' onChange={handleInput}/>
            {errorsSepc.name!="" && (<small className="text-danger form-text">{errorsSepc.name}</small>)}
        </div>
        <div className="confirmation-buttons">
          <button onClick={()=>handleConfirm()} className="confirm-button">Save</button>
          <button onClick={()=>onCancel()} className="cancel-button">Cancel</button>
        </div>
        {error && <small className="text-danger form-text">{error}</small>}
      </div>
    </div>
  );
};

export default DepartementAlert;