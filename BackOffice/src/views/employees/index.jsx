import { Add, ArrowCircleUp, ArrowCircleUpRounded, Clear, DeleteForever, EditNote, GroupAdd, Info, ModeEdit } from '@mui/icons-material';
import axios from 'axios';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";

import "./index.scss"
import AffectationAlert from 'components/AffectAlert/affectation';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const Employees = () => {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [showAlertAffectation, setShowAlertAffectation] = useState(false);
  const [employeeToAffect, setEmployeeToAffect]= useState({})

  const [deleteId, setDeleteId]= useState('')

  const navigate = useNavigate()

  const validateUsers = (data) => {
    return data.map((user, index) => {
      if (!user.Firstname || !user.Lastname || !user.Email || !user.Matricule || !user.Password) {
        throw new Error(`Row ${index + 1} is missing required fields.`);
      }
      return {
        firstname: user.Firstname.trim(),
        lastname: user.Lastname.trim(),
        password: user.Password.trim(),
        email: user.Email.trim(),
        matricule: user.Matricule.trim(),
      };
    });
  };

  const handleCancel = ()=>{
    setShowAlert(false)
    setShowAlertDelete(false)
    setShowAlertAffectation(false)


  }

  const handleConfirm = async() => {
    try {
      console.log(uploadedUsers)
      const respone = await axios.post("http://localhost:8070/api/users/import", validatedData);
      setShowAlert(false);
      alert(JSON.stringify(respone.data));
      setEmployees([...employees, ...respone.data])
      setValidatedData([]);
      console.log("employees",employees);
    } catch (error) {
      console.log(error)
    }
    
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON


      setValidatedData( validateUsers(parsedData));
      console.log("validatedUsers", validateUsers(parsedData))
      setShowAlert(true);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };

  const  handleModifier= (emp)=>{
      navigate('/app/dashboard/updateProfile',{state:{ values: emp}})

    }


    const  handleView= (emp)=>{
      navigate(`/app/dashboard/profile`,{state:{ values: emp}})
    }

    const  handleDelete= (id)=>{
      setShowAlertDelete(true)
      setDeleteId(id)
    }

    const handleDeleteEmployee= async(id)=>{
        try {
          setEmployees(employees.filter((emp)=>emp._id!=id))
          const response = await axios.delete(`http://localhost:8070/api/users/delete/${id}`);
          console.log('User deleted:', response.data);
          // Refresh the list of users after deletion
          setShowAlertDelete(false)
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      
    };

    const handleAddToDepartement = (emp)=>{
        setEmployeeToAffect(emp)
        setShowAlertAffectation(true)
    }

  useEffect(() => {
  
    fetch("http://localhost:8070/api/employees")
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
    return <div>Chargement...</div>;
  }


  return (
    <React.Fragment>
      <div className="buttons">
        <h1>Employees</h1>
          <Link to="add" className="link">
                  <Add/>
                    Add employee
          </Link>
          <div className="excel-Button">
                <div className="file-upload">
                  <ArrowCircleUp className="upload-icon" />
                  <span>Upload users from excel file</span>
                  <input type="file" accept=".xlsx, .xls" onChange={()=>handleFileUpload()} />
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
                    <div className="editButton" onClick={()=>handleModifier(emp)}>
                        <EditNote />
                      </div>
                      {emp.departement==null && (
                        <div className="groupButton" onClick={()=>handleAddToDepartement(emp)}>
                        <GroupAdd />
                      </div>
                      )}
                    <div className="deleteButton" onClick={()=>handleDelete(emp._id)}>
                      <DeleteForever/>
                    </div>
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
                                    message="Are you sure to delete this employee?"
                                    onConfirm={()=>handleDeleteEmployee(deleteId)}
                                    onCancel={handleCancel}
                                    />
                                )}

                      {showAlertAffectation && (
                                    <AffectationAlert
                                    message="Are you sure to delete this employee?"
                                    data={employeeToAffect}
                                    onConfirm={()=>AddToDepartement()}
                                    onCancel={handleCancel}
                                    />
                                )}
                      

    </React.Fragment>
  );
};

export default Employees;

