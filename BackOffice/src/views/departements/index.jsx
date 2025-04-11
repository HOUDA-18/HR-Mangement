import { Add, DeleteForever, EditNote, Info} from '@mui/icons-material';
import axios from 'axios';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./index.scss"
import DepartementAlert from 'components/DepartementAlert/departementAlert';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const Departements = () => {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [showAlertAddDept, setShowAlertAddDept]=useState(false)
  const [showAlertUpdateDept, setShowAlertUpdateDept]=useState(false)
  const [departement, setDepartement]= useState({})
  const [deleteId, setDeleteId]= useState('')

  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem("user"))


  const handleCancel = ()=>{
    setShowAlert(false)
    setShowAlertDelete(false)
    setShowAlertAddDept(false)
    setShowAlertUpdateDept(false)
    

  }

  const handleAdd = ()=>{
    setDepartement({
      code: "",
      name: ""
    })
    setShowAlertAddDept(true)
  }



  const  handleModifier= (dept)=>{
      setShowAlertUpdateDept(true)
      setDepartement(dept)
    }


    const  handleView= (dept)=>{
      navigate(`/app/dashboard/departements/details`,{state:{ values: dept}})
    }

    const  handleDelete= (id)=>{
      setShowAlertDelete(true)
      setDeleteId(id)
    }

    const handleDeleteDepartement= async(id)=>{
        try {
          setDepartements(departements.filter((dept)=>dept._id!=id))
          const response = await axios.delete(`http://localhost:8070/api/departements/${id}`);
          console.log('departement deleted:', response.data);
          // Refresh the list of users after deletion
          setShowAlertDelete(false)
        } catch (error) {
          console.error('Error deleting departement:', error);
        }
      
    };

  useEffect(() => {
  
    fetch("http://localhost:8070/api/departements")
      .then((res) => {
        console.log("Réponse du serveur :", res);
        return res.json();
      })
      .then((data) => {
        console.log("Données reçues :", data);
        setDepartements(data);
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
      <div className="buttons">
        <h1>Departements</h1>
          {(currentUser.role ==="ADMIN_HR" || currentUser.role==="MEMBRE_HR") && <div className="link" onClick={handleAdd}>
                  <Add/>
                    Add Departement
          </div>}

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
       List of departements
      </h1>
      {departements.length === 0 ? (
        <div style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '20px' }}>
          No departments found
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Code</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Name</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Employees count</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Teams count</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Actions</th>

            </tr>
          </thead>
          <tbody>
            {departements.map((dept) => (
              <tr key={dept._id} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ padding: '12px 15px', textAlign: 'left' }}><strong>{dept.code}</strong> </td>
                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{dept.name}</td>
                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{dept.employees.length}</td>
                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{dept.teams.length}</td>
                <td>
                  <div className="cellAction">
                  <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-view-user`}>
                                  View Departement details
                                </Tooltip>
                              }
                            >
                              <div className="viewButton" onClick={()=>handleView(dept._id)}>
                                <Info />
                              </div>
                  </OverlayTrigger>

                    {(currentUser.role ==="ADMIN_HR" || currentUser.role ==="MEMBRE_HR" || currentUser.role ==="SUPER_ADMIN" ) && 
                        <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-view-user`}>
                                      Edit departement informations
                                    </Tooltip>
                                  }
                                >
                                  <div className="editButton" onClick={()=>handleModifier(dept)}>
                                    <EditNote />
                                  </div>
                      </OverlayTrigger>}

                      {(currentUser.role ==="ADMIN_HR" || currentUser.role ==="MEMBRE_HR" || currentUser.role ==="SUPER_ADMIN" ) &&
                      <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-view-user`}>
                                    Delete departement permanently
                                  </Tooltip>
                                }
                              >
                                <div className="deleteButton" onClick={()=>handleDelete(dept._id)}>
                                  <DeleteForever/>
                                </div>
                    </OverlayTrigger>
                      }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

                      {showAlert && (
                                    <ConfirmationAlert
                                    message="Are you sure to add this list of users?"
                                    onConfirm={()=>handleConfirm()}
                                    onCancel={handleCancel}
                                    />
                                )}

                      {showAlertDelete && (
                                    <ConfirmationAlert
                                    message="Are you sure to delete this departement? All the users related will be with no departements"
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

export default Departements;