import { Add, AdminPanelSettings, DeleteForever, EditNote, Info, PersonOff, PersonPin} from '@mui/icons-material';
import axios from 'axios';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./index.scss"
import DepartementAlert from 'components/DepartementAlert/departementAlert';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const DepartementDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [showAlertAddDept, setShowAlertAddDept]=useState(false)
  const [showAlertUpdateDept, setShowAlertUpdateDept]=useState(false)
  const [deleteId, setDeleteId]= useState('')

  const navigate = useNavigate()
  const location = useLocation();

  var departement = location.state?.values 

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
    navigate(`/app/dashboard/profile`,{state:{ values: emp}})
  }
  useEffect(() => {
  
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <React.Fragment>
            { departement ? <>    
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
                                            <span className="itemValue">{departement.employees.length}</span>
                                        </div>

                                    </div>
                            </div>
                        
                                    <div style={{ 
                                        flex: 2,
                                        padding: '20px',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '8px',
                                        margin: '20px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <h1 style={{
                                        color: '#2c3e50',
                                        marginBottom: '20px',
                                        fontSize: '24px',
                                        fontWeight: '600',
                                        textAlign: 'center'
                                        }}>
                                        List of employees
                                        </h1>
                                        {employees.length === 0 ? (
                                        <div style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '20px' }}>
                                            Aucun employé trouvé
                                        </div>
                                        ) : (
                                        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
                                            <thead>
                                            <tr>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>FirstName</th>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>LastName</th>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Email</th>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Role</th>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Status</th>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Actions</th>
                                
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {employees.map((emp) => (
                                                <tr key={emp._id} style={{ borderBottom: '1px solid #dddddd' }}>
                                                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{emp.firstname}</td>
                                                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{emp.lastname}</td>
                                                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{emp.email}</td>
                                                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{emp.role}</td>
                                                <td style={{ padding: '12px 15px', textAlign: 'left' }}>
                                                    <div 
                                                        
                                                        className= {`status-indicator ${
                                                        emp.active ? 'active' : 'inactive'
                                                        }`}
                                
                                                        style={{
                                                        display: 'inline-block',
                                                        
                                                        width: '90px',
                                                        padding: '8px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600, // Augmentation du poids de la police
                                                        transition: 'all 0.3s ease',
                                                        backgroundColor: emp.active
                                                            ? 'rgba(40, 167, 69, 0.15)' 
                                                            : 'rgba(220, 53, 69, 0.1)', // Rouge plus visible pour inactive
                                                        color: emp.active
                                                            ? '#28a745' 
                                                            : '#dc3545', // Couleur rouge pour inactive
                                                        border: `2px solid ${
                                                            emp.active  ? '#28a745' : 'rgba(220, 53, 69, 0.3)'
                                                        }`,
                                                        boxShadow: emp.active
                                                            ? '0 2px 12px rgba(40, 167, 69, 0.25)' 
                                                            : '0 2px 8px rgba(220, 53, 69, 0.15)',
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                        }}
                                                    >
                                                        <span 
                                                        className="status-glow"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-50%',
                                                            left: '-50%',
                                                            width: '200%',
                                                            height: '200%',
                                                            background: emp.active 
                                                            ? 'radial-gradient(circle, rgba(40,167,69,0.15) 0%, transparent 60%)' 
                                                            : 'radial-gradient(circle, rgba(220,53,69,0.1) 0%, transparent 60%)',
                                                            pointerEvents: 'none'
                                                        }}
                                                        />
                                                        {emp.active ? 'Active' : 'Inactive'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cellAction">
                                                        <div className="viewButton" onClick={()=>handleView(emp)}>
                                                            <Info/>
                                                        </div>
                                                            {emp.role!="HEAD_DEPARTEMENT" &&
                                                                ( <div className="editButton" onClick={()=>handleMakeHeadDepartement(emp)}>
                                                                    <AdminPanelSettings />
                                                                    </div>
                                                                    )}
                                                        <div className="deleteButton" onClick={()=>handleExitDepartement(emp._id)}>
                                                            <PersonOff/>
                                                        </div>
                                                    </div>
                                                </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        )}
                                    </div>      
                                 
                         </>
                :
                <div>
                    No data found
                </div> }

                      {showAlert && (
                                    <ConfirmationAlert
                                    message="Are you sure to add this list of users?"
                                    onConfirm={()=>handleConfirm()}
                                    onCancel={handleCancel}
                                    />
                                )}

                      {showAlertDelete && (
                                    <ConfirmationAlert
                                    message="Are you sure to delete this departement?"
                                    onConfirm={()=>handleDeleteDepartement(deleteId)}
                                    onCancel={handleCancel}
                                    />
                                )}

                      {showAlertAddDept && (
                                    <DepartementAlert
                                    data={departement}
                                    type="add"
                                    onConfirm={handleCancel}
                                    onCancel={handleCancel}
                                    />
                                )}

                      {showAlertUpdateDept && (
                                    <DepartementAlert
                                    data= {departement}
                                    type="update"
                                    onConfirm={handleCancel}
                                    onCancel={handleCancel}
                                    />
                                )}

    </React.Fragment>
  );
};

export default DepartementDetails;