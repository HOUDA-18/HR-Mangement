import { Close, VerifiedUser } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import './index.scss'; // Import SCSS file
import { skillsOptions } from 'skillOptions';

const TeamDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [team, setTeam] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAlertMakeHead, setShowAlertMakeHead] = useState(false);
  const [showAlertDetach, setShowAlertDetach] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false); // État pour afficher le formulaire
  const [offerData, setOfferData] = useState({
    title: '',
    description: '',
    numberofplace: '',
    typeContrat: '',
    niveaudetude: '',
    anneeexperience: '',
    departement: '',
    team: '', 
    skills: []


  });
  const [memberId, setMemberId] = useState(0);
  const teamId = location.state?.values;
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleCancel = () => {
    setShowAlertDetach(false);
    setShowAlertMakeHead(false);
    setShowOfferForm(false); // Ferme le formulaire
  };

  const handleConfirmDetach = (id) => {
    setShowAlertDetach(true);
    setMemberId(id);
  };

  const handleConfirmMakeHead = (id) => {
    setShowAlertMakeHead(true);
    setMemberId(id);
  };

  const handleMakeHeadTeam = (memberID) => {
    axios
      .post(`http://localhost:8070/api/teams/assignHeadTeam/${teamId}/${memberID}`)
      .then((res) => {
        console.log('res: ', res);
        setShowAlertMakeHead(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  };

  const handleDetachFromTeam = (memberID) => {
    axios
      .put(`http://localhost:8070/api/teams/detachEmployee/${teamId}/${memberID}`)
      .then((res) => {
        console.log('res: ', res);
        setShowAlertDetach(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  };

  const fetchTeamMembers = (id) => {
    fetch(`http://localhost:8070/api/employeesByTeam/${id}`)
      .then((res) => {
        console.log('Réponse du serveur :', res);
        return res.json();
      })
      .then((data) => {
        console.log('Données reçues :', data);
        setTeamMembers(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des employés :', error);
      });
  };

  const viewDetails = (emp) => {
    navigate(`/app/dashboard/employees/employeeDetails`, { state: { values: emp } });
  };

  const handleAddOffer = () => {
    setShowOfferForm(true);
  };

  // Handle form submission for adding an offer
  const handleSubmit = (e) => {
    e.preventDefault();
    const offer = {
      title: offerData.title,
    description: offerData.description,
    numberofplace: offerData.numberofplace,
    typeContrat: offerData.typeContrat,
    niveaudetude: offerData.niveaudetude,
    anneeexperience: offerData.anneeexperience,
    departement: team.departement,
    team: team._id, 
    skills: team.skills
    }
    setOfferData({
      title: '',
      description: '',
      numberofplace: '',
      typeContrat: '',
      niveaudetude: '',
      anneeexperience: '',
      departement: '',
      team: '', 
      skills: []
    })
    console.log("offerData: ",offer)
    // Send the offer data to the backend
     axios
      .post('http://localhost:8070/api/offre/addoffre', offer)
      .then((response) => {
        console.log('Offer added successfully:', response.data);
        setShowOfferForm(false); // Close the form after submission
        // You can refresh the page or show a success message
      })
      .catch((error) => {
        console.error('Error adding offer:', error);
        // Handle the error (e.g., display an error message to the user)
      }); 
  };

  useEffect(() => {
    fetch(`http://localhost:8070/api/teams/${teamId}`)
      .then((res) => {
        console.log('Réponse du serveur :', res);
        return res.json();
      })
      .then((data) => {
        console.log('Données reçues :', data);
        setTeam(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des employés :', error);
      });
    fetchTeamMembers(teamId);
  }, []);

  return (
    <React.Fragment>
      <div className="team-container">
        <h1>{team.name}</h1>
        <p className="team-code">Code: {team.code}</p>

        <div className="team-head">
          <h3>Head of Team:</h3>
          {teamMembers.filter((member) => member._id == team.headTeam).length > 0 ? (
            <p>
              {teamMembers.filter((member) => member._id == team.headTeam)[0]?.firstname}{' '}
              {teamMembers.filter((member) => member._id == team.headTeam)[0]?.lastname}
            </p>
          ) : (
            <p>Not attribute</p>
          )}
        </div>

                      {team?.skills?.length > 0 && (
                        <div className="offer-skills">
                          <h4>Skills:</h4>
                          <div className="skills-list">
                            {team.skills.map((skill, idx) => {
                              const skillData = skillsOptions.find((s) => s.name === skill);
                              return (
                                <div key={idx} className="skill-item">
                                  {skillData ? (
                                    <>
                                      <img src={skillData.image} alt={skillData.name} title={skillData.name} />
                                      <span>{skillData.name}</span>
                                    </>
                                  ) : (
                                    <span>{skill}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
      </div>

      <div className="team-members">
        <h3>Team Members:</h3>
        <div className="member-grid">
          {teamMembers?.map((member, index) => (
            <div key={index} className="member-card">
              {/* Edit Button on Top Left */}
              {(currentUser.role === 'SUPER_ADMIN' ||
                (currentUser.role === 'HEAD_DEPARTEMENT' && currentUser.departement === team.departement)) && (
                <button
                  className="edit-btn"
                  title="Detach from the team"
                  onClick={() => handleConfirmDetach(member._id)}
                >
                  <Close size={18} />
                </button>
              )}
              {/* Info Button on Top Right */}
              {member._id !== team.headTeam &&
                (currentUser.role === 'SUPER_ADMIN' ||
                  (currentUser.role === 'HEAD_DEPARTEMENT' && currentUser.departement === team.departement)) && (
                  <button
                    className="info-btn"
                    title="Confirm as Head of Team"
                    onClick={() => handleConfirmMakeHead(member._id)}
                  >
                    <VerifiedUser size={18} />
                  </button>
                )}

              <div className="avatar" onClick={() => viewDetails(member._id)}>
                {member.firstname.charAt(0)}
                {member.lastname.charAt(0)}
              </div>
              <h4>
                {member.firstname} {member.lastname}
              </h4>
              <p>{member.matricule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button for adding offer */}
      {(teamMembers.length >= 5 ||teamMembers.length <5   )&& (
        <button className="add-offer-btn" onClick={handleAddOffer}>
          Add Offer
        </button>
      )}

      {/* Offer Form Popup */}
      {showOfferForm && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add an Offer</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Offer Title :</label>
                <input
                  type="text"
                  name="title"
                  value={offerData.title}
                  onChange={(e) => setOfferData({ ...offerData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Description :</label>
                <textarea
                  name="description"
                  value={offerData.description}
                  onChange={(e) => setOfferData({ ...offerData, description: e.target.value })}
                  required
                ></textarea>
              </div>
              <div>
                <label>Number of Positions :</label>
                <input
                  type="number"
                  name="numberofplace"
                  value={offerData.numberofplace}
                  onChange={(e) => setOfferData({ ...offerData, numberofplace: e.target.value })}
                  min="1"
                  required
                />
              </div>
              <div>
                <label>Contract Type :</label>
                <select
                  name="typeContrat"
                  value={offerData.typeContrat}
                  onChange={(e) => setOfferData({ ...offerData, typeContrat: e.target.value })}
                  required
                >
                  <option value="">Select a type</option>
                  <option value="CDI">Permanent Contract (CDI)</option>
                  <option value="CDD">Fixed-Term Contract (CDD)</option>
                  <option value="Stage">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label>Education Level :</label>
                <select
                  name="niveaudetude"
                  value={offerData.niveaudetude}
                  onChange={(e) => setOfferData({ ...offerData, niveaudetude: e.target.value })}
                  required
                >
                  <option value="">Select a Level</option>
                  <option value="primary">Primary Education Level</option>
                  <option value="secondary">Secondary Education Level</option>
                  <option value="licence">Post-Secondary Education Level (Bac +1 to Bac +2)</option>
                  <option value="licence">Bachelor's Degree (Bac +3)</option>
                  <option value="master">Master's Degree (Bac +5)</option>
                  <option value="Engineering">Engineering Degree (Bac +5)</option>
                  <option value="doctorat">Doctorate (Bac +8)</option>
                  <option value="formation">Specialized Technical Training</option>
                </select>
              </div>
              <div>
                <label>Years of Experience :</label>
                <input
                  type="number"
                  name="anneeexperience"
                  value={offerData.anneeexperience}
                  onChange={(e) => setOfferData({ ...offerData, anneeexperience: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Add
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default TeamDetails;
