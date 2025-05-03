import { Add, AdminPanelSettings, ArrowDownward, ArrowUpward, DeleteForever, EditNote, GroupAdd, Info, PersonOff, PersonPin} from '@mui/icons-material';
import axios from 'axios';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./index.scss"
import DepartementAlert from 'components/DepartementAlert/departementAlert';
import TeamCard from 'components/TeamCard/teamCard';
import AffectationAlert from 'components/AffectAlert/affectation';
import EmployeesTable from 'components/EmployeesTable/employeesTable';
import { HRskills } from 'HrDepartementSkills';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const DepartementDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [showAlertDeleteTeam, setShowAlertDeleteTeam] = useState(false);
  const [showAlertUpdateTeam, setShowAlertUpdateTeam]=useState(false)
  const [deleteId, setDeleteId]= useState('')
  const [isVisible, setIsVisible] = useState(false);
  const [teams, setTeams]= useState([]);
  const [departement, setDepartement]= useState({});
  const [team, setTeam]=useState({});
  const [showAlertAddTeam, setShowAlertAddTeam]=useState(false)
  const [showAlertAffectation, setshowAlertAffectation]= useState(false)
  const [employeeToAffect,setEmployeeToAffect]= useState({})
  const currentUser = JSON.parse(localStorage.getItem("user"))
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [errors, setErrors] = useState({});

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
  const handleAddOffer = () => {
    setShowOfferForm(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!offerData.title.trim()) newErrors.title = "Offer title is required.";
    if (!offerData.description.trim()) newErrors.description = "Description is required.";
    if (!offerData.numberofplace || offerData.numberofplace <= 0) newErrors.numberofplace = "Enter a valid number of positions.";
    if (!offerData.typeContrat) newErrors.typeContrat = "Contract type is required.";
    if (!offerData.niveaudetude) newErrors.niveaudetude = "Education level is required.";
    if (offerData.anneeexperience === '' || offerData.anneeexperience < 0) newErrors.anneeexperience = "Years of experience must be zero or more.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission for adding an offer

  const navigate = useNavigate()
  const location = useLocation();

  var departementId = location.state?.values 
  const handleCancel = ()=>{
    setShowAlertAddTeam(false)
    setShowAlertDeleteTeam(false)
    setShowAlertUpdateTeam(false)
    setshowAlertAffectation(false)
    setShowOfferForm(false)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if(validate()){
      const offer = {
        title: offerData.title,
        description: offerData.description,
        numberofplace: offerData.numberofplace,
        typeContrat: offerData.typeContrat,
        niveaudetude: offerData.niveaudetude,
        anneeexperience: offerData.anneeexperience,
        departement: departementId,
        team: departementId, 
        skills: HRskills
        }

        console.log("offerData: ",offer)
        // Send the offer data to the backend
         axios
          .post('http://localhost:8070/api/offre/addoffre', offer)
          .then((response) => {
            console.log('Offer added successfully:', response.data);
            setShowOfferForm(false); // Close the form after submission
            setErrors({})
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
            // You can refresh the page or show a success message
          })
          .catch((error) => {
            console.error('Error adding offer:', error);
            setErrors({})
            // Handle the error (e.g., display an error message to the user)
          });
    }
 
  };

  const handleDeleteTeam= async()=>{
    try {
      setTeams(teams.filter((t)=>t._id!==team._id))
      const response = await axios.delete(`http://localhost:8070/api/deleteTeam/${team._id}`);
      console.log('team deleted:', response.data);
      // Refresh the list of users after deletion
      setShowAlertDeleteTeam(false)
    } catch (error) {
      console.error('Error deleting departement:', error);
    }
  
};

const AddToTeam=async()=>{
    try {
        const response = await axios.delete(`http://localhost:8070/api/teams/assignEmployee/:idTeam/${employeeToAffect._id}`);
        console.log('team deleted:', response.data);
        // Refresh the list of users after deletion
        setShowAlertDeleteTeam(false)
      } catch (error) {
        console.error('Error deleting departement:', error);
      }
}


const handleAddToTeam = (emp)=>{
    setEmployeeToAffect(emp)
    setshowAlertAffectation(true)
}


  const  handleMakeHeadDepartement = (emp)=>{
     axios.post(`http://localhost:8070/api/departements/assignChefDepartement/${departement._id}/${emp._id}`)
     .then(()=>{
        window.location.reload();
     }).catch((err)=>{
        console.log("error:",err)
     })
  }

  const handleExitDepartement = (id)=>{
    axios.put(`http://localhost:8070/api/departements/detachEmployee/${departement._id}/${id}`)
    .then((res)=>{
       window.location.reload();
    }).catch((err)=>{
       console.log("error:",err)
    })
  }
  const  handleView= (emp)=>{
    navigate(`/app/dashboard/employees/employeeDetails`,{state:{ values: emp._id}})
  }
  const fetchTeams = async ()=>{
    console.log("departementId: ",departementId)
    axios.get(`http://localhost:8070/api/teamsByDepartement/${departementId}`)
    .then((res) => {
      console.log("departement :", res.data);
      setTeams(res.data);

    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des teams :", error);
    });
  }
  const fetchDepartement = async ()=>{
    console.log("departementId: ",departementId)
    axios.get(`http://localhost:8070/api/departements/getById/${departementId}`)
    .then((res) => {
      console.log("departement :", res.data);
      setDepartement(res.data);

    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des employés :", error);
    });
  }


  const handleAdd = ()=>{
    setTeam({
      code: "",
      name: "",
      skills: [''],
      departement: departementId
    })
    setShowAlertAddTeam(true)
  }
  useEffect(() => {
    fetchDepartement()
    fetchTeams()
    if(isVisible){
        setLoading(true)
        fetch(`http://localhost:8070/api/departements/${departement._id}`)
        .then((res) => {
          console.log("Réponse du serveur :", res);
          return res.json();
        })
        .then((data) => {
          console.log("Données reçues :", data);
          setEmployees(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des employés :", error);
          setLoading(false);
        });
    }

  }, [isVisible]);




  return (
    <React.Fragment>
            { departement!={} ? <>    
                            <div className="departement-container">
                                <div className="Livrable">
                                        <div className="left">
                                            <div className="detailItem">
                                                <span className="itemKey">Code : </span>
                                                <span className="itemValue">{departement.code}</span>
                                            </div>
                                        
                                        </div>
                                        <div className="firstCenter">
                                            <div className="detailItem">
                                                <span className="itemKey">Name: </span>
                                                <span className="itemValue">{departement.name}</span>
                                            </div>

                                        </div>
                                        <div className="right">
                                                
                                            <div className="detailItem">
                                                <span className="itemKey">Employees count: </span>
                                                <span className="itemValue">{departement.employees?.length}</span>
                                            </div>

                                        </div>
                                </div>
                                
                                { (currentUser.role ==="HEAD_DEPARTEMENT" && currentUser.departement == departement._id)  && <div className="link" onClick={handleAdd}>
                                        <Add/>
                                            Add Team
                                </div> }

                                { (currentUser.role ==="ADMIN_HR" && departement.name === "HR")  && <div className="link" onClick={handleAddOffer}>
                                        <Add/>
                                            Add offre
                                </div> }
                            </div>

                            <div className="team-grid">
                                {teams!=[] && teams.map((team, index) => (
                                    <TeamCard 
                                    showAlertDeleteTeam = {showAlertDeleteTeam}
                                    setShowAlertDeleteTeam = {setShowAlertDeleteTeam}
                                    setShowAlertUpdateTeam= {setShowAlertUpdateTeam}
                                    showAlertUpdateTeam = {showAlertUpdateTeam}
                                    setTeam = {setTeam}
                                    key={index} team={team} />
                                ))}
                             </div>
                             <div className="button-container">
                                <button className="toggle-button" onClick={() => setIsVisible(!isVisible)}>
                                    {isVisible ? "Hide Employees" : "Show All Employees"}
                                    {isVisible ? <ArrowUpward size={20} className='svg' /> : <ArrowDownward size={20} className='svg'/>}
                                </button>
                             </div>
                             
                                 { isVisible &&   
                                   
                                  (<EmployeesTable departementID= {departementId}/>)
                                  }
                                 
                         </>
                :
                <div>
                    No data found
                </div> }

                      {showAlertDeleteTeam && (
                                    <ConfirmationAlert
                                    message="Are you sure to delete this team?"
                                    onConfirm={()=>handleDeleteTeam()}
                                    onCancel={handleCancel}
                                    />
                                )}

                     {showAlertAddTeam && (
                                    <DepartementAlert
                                    data={team}
                                    type="addTeam"
                                    onConfirm={handleCancel}
                                    onCancel={handleCancel}
                                    />
                                )}
                    {showAlertUpdateTeam && (
                                    <DepartementAlert
                                    data={team}
                                    type="updateTeam"
                                    onConfirm={handleCancel}
                                    onCancel={handleCancel}
                                    />
                                )}
                    {showAlertAffectation && (
                                    <AffectationAlert
                                    message="Are you sure to delete this employee?"
                                    data={employeeToAffect}
                                    type="team"
                                    onConfirm={()=>AddToTeam()}
                                    onCancel={handleCancel}
                                    />
                                )}
                    
                    { showOfferForm && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Add an Offer</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Offer Title:</label>
              <input
                type="text"
                name="title"
                className={errors.title ? 'invalid' : ''}
                value={offerData.title}
                onChange={(e) => setOfferData({ ...offerData, title: e.target.value })}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div>
              <label>Description:</label>
              <textarea
                name="description"
                className={errors.description ? 'invalid' : ''}
                value={offerData.description}
                onChange={(e) => setOfferData({ ...offerData, description: e.target.value })}
              ></textarea>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div>
              <label>Number of Positions:</label>
              <input
                type="number"
                name="numberofplace"
                className={errors.numberofplace ? 'invalid' : ''}
                value={offerData.numberofplace}
                onChange={(e) => setOfferData({ ...offerData, numberofplace: e.target.value })}
                min="1"
              />
              {errors.numberofplace && <span className="error-message">{errors.numberofplace}</span>}
            </div>

            <div>
              <label>Contract Type:</label>
              <select
                name="typeContrat"
                className={errors.typeContrat ? 'invalid' : ''}
                value={offerData.typeContrat}
                onChange={(e) => setOfferData({ ...offerData, typeContrat: e.target.value })}
              >
                <option value="">Select a type</option>
                <option value="CDI">Permanent Contract (CDI)</option>
                <option value="CDD">Fixed-Term Contract (CDD)</option>
                <option value="Stage">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
              {errors.typeContrat && <span className="error-message">{errors.typeContrat}</span>}
            </div>

            <div>
              <label>Education Level:</label>
              <select
                name="niveaudetude"
                className={errors.niveaudetude ? 'invalid' : ''}
                value={offerData.niveaudetude}
                onChange={(e) => setOfferData({ ...offerData, niveaudetude: e.target.value })}
              >
                <option value="">Select a Level</option>
                <option value="primary">Primary Education Level</option>
                <option value="secondary">Secondary Education Level</option>
                <option value="licence">Post-Secondary Education (Bac +1 to Bac +2)</option>
                <option value="licence">Bachelor's Degree (Bac +3)</option>
                <option value="master">Master's Degree (Bac +5)</option>
                <option value="Engineering">Engineering Degree (Bac +5)</option>
                <option value="doctorat">Doctorate (Bac +8)</option>
                <option value="formation">Specialized Technical Training</option>
              </select>
              {errors.niveaudetude && <span className="error-message">{errors.niveaudetude}</span>}
            </div>

            <div>
              <label>Years of Experience:</label>
              <input
                type="number"
                name="anneeexperience"
                className={errors.anneeexperience ? 'invalid' : ''}
                value={offerData.anneeexperience}
                onChange={(e) => setOfferData({ ...offerData, anneeexperience: e.target.value })}
                min="0"
              />
              {errors.anneeexperience && <span className="error-message">{errors.anneeexperience}</span>}
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

export default DepartementDetails;