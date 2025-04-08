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

  const navigate = useNavigate()
  const location = useLocation();

  var departementId = location.state?.values 
  const handleCancel = ()=>{
    setShowAlertAddTeam(false)
    setShowAlertDeleteTeam(false)
    setShowAlertUpdateTeam(false)
    setshowAlertAffectation(false)
  }

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
                                
                                { (currentUser.role ==="SUPER_ADMIN" ||(currentUser.role ==="HEAD_DEPARTEMENT" && currentUser.departement == departement._id) ) && <div className="link" onClick={handleAdd}>
                                        <Add/>
                                            Add Team
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
                    

    </React.Fragment>
  );
};

export default DepartementDetails;