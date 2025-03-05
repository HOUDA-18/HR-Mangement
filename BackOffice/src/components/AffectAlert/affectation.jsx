import React, { useEffect, useState } from 'react';
import './affectation.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import formValidation from 'components/DepartementAlert/formValidator';


const AffectationAlert = ({data, onCancel, onConfirm }) => {
    const [values, setValues]=useState(data)
    const [departements, setDepartements]=useState([])
     const [selectedOption, setSelectedOption]= useState({});
    const [errorsSepc, setErrorsSepc]= useState({});
    const [error, setError]=useState("");
   const navigate = useNavigate()
/*
    
    const handleInput = (event)=>{
        setValues(prev => ({...prev, [event.target.name] : event.target.value}));
    }
*/

const handleInput = (event)=>{
    setSelectedOption( event.target.value);
    console.log("e: ", JSON.stringify(event.target.value))
}
    const handleConfirm= (event)=>{
        axios.put(`http://localhost:8070/api/departements/assignEmployee/${selectedOption}/${data._id}`)
        .then(()=>{
            axios.get(`http://localhost:8070/api/departements/getById/${selectedOption}`).then((res)=>{

                navigate(`/app/dashboard/departements/details`,{state:{ values: res.data}})

            }).catch((errr)=>{
                console.log("error2: ",errr)
            })
        })
        .catch((err)=>{
            console.log("error: ",err)
        })


    } 

    useEffect(() => {
  
        fetch("http://localhost:8070/api/departements")
          .then((res) => {
            console.log("Réponse du serveur :", res);
            return res.json();
          })
          .then((data) => {
            console.log("Données reçues :", data);
            setDepartements(data);
            setSelectedOption(data[0]._id)
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des employés :", error);
          });
      }, []);
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-alert">
        <h4>Please choose a departement</h4>
        <div className="field">
            <select value={selectedOption} onChange={(e) => handleInput(e)}
>
                {departements.map((option, index) => (
                    <option key={index} value={option._id}  >
                            {option.name}
                    </option>
                ))}
        </select>
        </div>

        <div className="confirmation-buttons">
          <button onClick={()=>handleConfirm()} className="confirm-button">Save</button>
          <button onClick={()=>onCancel()} className="cancel-button">Cancel</button>
        </div>

      </div>
    </div>
  );
};

export default AffectationAlert;