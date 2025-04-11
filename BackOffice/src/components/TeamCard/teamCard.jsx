import React, { useEffect, useState } from "react";
import "./teamCard.scss"; // Import SCSS file
import { Cases, Delete, Edit, Info, VerifiedUser } from "@mui/icons-material";
import ConfirmationAlert from "components/confirmationAlert/confirmationAlert";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TeamCard = ({ team ,  showAlertDeleteTeam, setShowAlertDeleteTeam, setTeam , setShowAlertUpdateTeam, showAlertUpdateTeam}) => {
  const navigate = useNavigate()
  const [headTeam, setHeadTeam]= useState({})
  const currentUser = JSON.parse(localStorage.getItem("user"))

  const onViewDetails= (id)=>{
      navigate('/app/dashboard/departements/details/team/details', {state:{ values: id}})
  }
  useEffect(() => {
    if(team.headTeam!=null){
      fetch(`http://localhost:8070/api/users/getById/${team.headTeam}`)
      .then((res) => {
        console.log("Réponse du serveur :", res);
        return res.json();
      })
      .then((data) => {
        console.log("Données reçues :", data);
        setHeadTeam(data)
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des employés :", error);
        setLoading(false);
      });
    }

  }, []);
  return (
    <div className={`team-card ${team.teamMembers?.length < 5 ? "low-members" : ""}`}>
      <div className="icon">
        <Cases size={24} />
      </div> 
      <div className="details">
        <h2 className="team-name">{team.name}</h2>
        <p className="team-code">Code: {team.code}</p>
        <p className="team-members">
          <VerifiedUser size={16} /> {team.teamMembers?.length} members
        </p>
         <p className="team-head">
          <span>Head:</span> {headTeam?.firstname ?headTeam.firstname +" "+ headTeam.lastname :"Not attribute" }
        </p> 
      </div>

      <div className="actions">
          <button
            className="details-btn"
            title="Click to view full team details"
            onClick={() => onViewDetails(team._id)}
          >
            <Info size={18} />
          </button>

          {(currentUser.role === "SUPER_ADMIN" ||
            (currentUser.role === "HEAD_DEPARTEMENT" && currentUser.departement === team.departement)) && (
            <>
              <button
                className="update-btn"
                title="Click to edit this team's information"
                onClick={() => {
                  setShowAlertUpdateTeam(true);
                  setTeam(team);
                }}
              >
                <Edit size={18} />
              </button>
              <button
                className="delete-btn"
                title="Click to delete this team permanently"
                onClick={() => {
                  setShowAlertDeleteTeam(true);
                  setTeam(team);
                }}
              >
                <Delete size={18} />
              </button>
            </>
          )}
       
      </div>

    </div>

    
  );
};

export default TeamCard;
