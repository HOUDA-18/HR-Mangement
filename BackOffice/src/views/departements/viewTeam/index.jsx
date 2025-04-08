import { Add, ArrowCircleUp, ArrowCircleUpRounded, Clear, Close, DeleteForever, EditNote, GroupAdd, Info, ModeEdit, VerifiedUser } from '@mui/icons-material';
import axios from 'axios';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";

import "./index.scss"
import AffectationAlert from 'components/AffectAlert/affectation';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const TeamDetails = () => {

  const navigate = useNavigate()
    const location = useLocation();
    const [team, setTeam]= useState({})
    const [teamMembers, setTeamMembers]=useState([])
    const [showAlertMakeHead, setShowAlertMakeHead]= useState(false)
    const [showAlertDetach, setShowAlertDetach]= useState(false)
    const [memberId, setMemberId]=useState(0);
    const teamId = location.state?.values
    const currentUser = JSON.parse(localStorage.getItem("user"))

/*     const handleEdit=()=>{
        navigate('/app/dashboard/employees/add', {state:{ values: teamId}})
    } */

    const handleCancel = ()=>{
      setShowAlertDetach(false)
      setShowAlertMakeHead(false)
    }
   const  handleConfirmDetach = (id)=>{
        setShowAlertDetach(true)
        setMemberId(id)
    }
    const handleConfirmMakeHead = (id)=>{
      setShowAlertMakeHead(true)
      setMemberId(id)
    }

    const handleMakeHeadTeam = (memberID)=>{
      axios.post(`http://localhost:8070/api/teams/assignHeadTeam/${teamId}/${memberID}`)
      .then((res)=>{
          console.log("res: ", res)
          setShowAlertMakeHead(false)
          window.location.reload()

      }).catch((err)=>{
        console.log("error: ", err)
      })
    }

    const handleDetachFromTeam = (memberID)=>{
      axios.put(`http://localhost:8070/api/teams/detachEmployee/${teamId}/${memberID}`)
      .then((res)=>{
          console.log("res: ", res)
          setShowAlertDetach(false)
          window.location.reload()

      }).catch((err)=>{
        console.log("error: ", err)
      })
    }

   const  fetchTeamMembers = (id)=>{
      fetch(`http://localhost:8070/api/employeesByTeam/${id}`)
          .then((res) => {
            console.log("Réponse du serveur :", res);
            return res.json();
          })
          .then((data) => {
            console.log("Données reçues :", data);
            setTeamMembers(data)
            console.log("teamHead:", data.filter((member)=> member._id==team.headTeam))
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des employés :", error);
          });
    }


    const  viewDetails= (emp)=>{
      navigate(`/app/dashboard/employees/employeeDetails`,{state:{ values: emp}})
    }
    useEffect(() => {
   
        fetch(`http://localhost:8070/api/teams/${teamId}`)
          .then((res) => {
            console.log("Réponse du serveur :", res);
            return res.json();
          })
          .then((data) => {
            console.log("Données reçues :", data);
            setTeam(data)
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des employés :", error);
          });
          fetchTeamMembers(teamId)
      }, []);



  return (
    <React.Fragment>
     <div className="team-container">
      <h1>{team.name}</h1>
      <p className="team-code">Code: {team.code}</p>

      <div className="team-head">
        <h3>Head of Team:</h3>
        {teamMembers.filter((member)=> member._id==team.headTeam).length>0 ? 
                <p>{teamMembers.filter((member)=> member._id==team.headTeam)[0]?.firstname} {teamMembers.filter((member)=> member._id==team.headTeam)[0]?.lastname}</p>

        :
               <p> Not attribute</p>
      }
      </div>

      
    </div>

    <div className="team-members">
        <h3>Team Members:</h3>
        <div className="member-grid">
          {teamMembers?.map((member, index) => (
            <div key={index} className="member-card">
              {/* Edit Button on Top Left */}
              {( currentUser.role ==="SUPER_ADMIN" ||(currentUser.role ==="HEAD_DEPARTEMENT" && currentUser.departement == team.departement) ) 
              &&<button className="edit-btn" title="Detach from the team" onClick={()=>handleConfirmDetach(member._id)}>
                <Close size={18} />
              </button>}
              {/* Info Button on Top Right */}
              { member._id!=team.headTeam && ( currentUser.role ==="SUPER_ADMIN" ||(currentUser.role ==="HEAD_DEPARTEMENT" && currentUser.departement == team.departement) ) && 
                            <button className="info-btn" title="Confirm as Head of Department" onClick={()=>handleConfirmMakeHead(member._id)}>
                            <VerifiedUser size={18} />
                          </button>
              }

              <div className="avatar" onClick={()=>viewDetails(member._id)}>
                {member.firstname.charAt(0)}
                {member.lastname.charAt(0)}
              </div>
              <h4> {member.firstname} {member.lastname} </h4>
              <p> {member.matricule}  </p>
            </div>
          ))}
        </div>
      </div>

      {showAlertDetach && (
                                    <ConfirmationAlert
                                    message="Are you sure to detach this member frome this team?"
                                    onConfirm={()=>handleDetachFromTeam(memberId)}
                                    onCancel={handleCancel}
                                    />
                                )}
           {showAlertMakeHead && (
                                    <ConfirmationAlert
                                    message="Are you sure to make this member head team?"
                                    onConfirm={()=>handleMakeHeadTeam(memberId)}
                                    onCancel={handleCancel}
                                    />
                                )}
    </React.Fragment>
  );
};

export default TeamDetails;

