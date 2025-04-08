import React, { useEffect, useState } from 'react';
import './affectation.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import formValidation from 'components/DepartementAlert/formValidator';


const AffectationAlert = ({data, onCancel, onConfirm , type}) => {
    const [departements, setDepartements]=useState([])
     const [selectedOption, setSelectedOption]= useState({});
     const [erreur, setErreur]=useState("");
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
      if(type==="departement"){
        axios.put(`http://localhost:8070/api/departements/assignEmployee/${selectedOption}/${data._id}`)
        .then(()=>{
            axios.get(`http://localhost:8070/api/departements/getById/${selectedOption}`).then((res)=>{

                navigate(`/app/dashboard/departements/details`,{state:{ values: res.data._id}})

            }).catch((errr)=>{
                console.log("error2: ",errr)
            })
        })
        .catch((err)=>{
            console.log("error: ",err)
            setErreur(err.response.data);
        })
      }
       if(type==="team"){
        axios.put(`http://localhost:8070/api/teams/assignEmployee/${selectedOption}/${data._id}`)
          .then((res)=>{
            console.log('team deleted:', res.data);
            // Refresh the list of users after deletion
            window.location.reload()
          }).catch ((error)=> {
          console.error('Error deleting departement:', error);
          setErreur(error.response.data);
        })
      }
    } 
  

    useEffect(() => {
        if(type==="departement"){
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
        }if(type==="team"){
          fetch(`http://localhost:8070/api/teamsByDepartement/${data.departement}`)
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
        }

      }, []);
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-alert">
        <h4>Please choose a departement</h4>
        <div className="field">
            <select value={selectedOption} onChange={(e) => handleInput(e)}>

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

        {erreur && <small className="text-danger form-text">{erreur}</small>}

      </div>
    </div>
  );
};

export default AffectationAlert;