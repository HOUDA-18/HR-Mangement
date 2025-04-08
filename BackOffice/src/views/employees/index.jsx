import { Add, ArrowCircleUp,  DeleteForever, EditNote, GroupAdd, Info } from '@mui/icons-material';
import axios from 'axios';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  Col, Card, Table,Form, Button, Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import * as XLSX from "xlsx";

import "./index.scss"
import AffectationAlert from 'components/AffectAlert/affectation';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const Employees = () => {
  const [filterText, setFilterText] = useState('');

  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState("");
  const [departements, setDepartements]= useState([])
  const [sortBy, setSortBy] = useState('');  
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [showAlertAffectation, setShowAlertAffectation] = useState(false);
  const [employeeToAffect, setEmployeeToAffect]= useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [importing, setImporting]= useState(false);
  const [endImporting, setEndImporting]= useState(false);
  const limit = 5;
  const [deleteId, setDeleteId]= useState('')
  const [sortOrder, setSortOrder] = useState('asc');

  const currentUser = JSON.parse(localStorage.getItem("user"))

  const navigate = useNavigate()

  const validateUsers = (data) => {
    return data.map((user, index) => {
      if (!user.firstname || !user.lastname || !user.email || !user.matricule || !user.password || !user.employmentType) {
        throw new Error(`Row ${index + 1} is missing required fields.`);
      }
      return {
        firstname: user.firstname.trim(),
        lastname: user.lastname.trim(),
        password: user.password.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
        matricule: user.matricule.trim(),
        employmentType: user.employmentType.trim()
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
      setImporting(true)
      setShowAlert(false);
      const respone = await axios.post("http://localhost:8070/api/users/import", validatedData);
      setImporting(false)
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
      navigate(`/app/dashboard/employees/employeeDetails`,{state:{ values: emp._id}})
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

   // Sorting handler
   const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    let updated = [...employees];
  
    // Filter by search input
    if (filterText.trim() !== "") {
      updated = updated.filter(user =>
        Object.values(user).some(value =>
          String(value).toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }
  
    // Sorting logic
    if (sortBy) {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      updated.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * modifier;
        if (a[sortBy] > b[sortBy]) return 1 * modifier;
        return 0;
      });
    }
  
    setFilteredEmployees(updated);
  }, [employees, filterText, sortBy, sortOrder]);
    
useEffect(() => {
  // This runs only once, on initial mount
  fetch('http://localhost:8070/api/departements')
    .then((res) => res.json())
    .then((data) => {
      console.log("Départements :", data);
      setDepartements(data); // adjust based on your API structure
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des départements :", error);
    });
}, []);

  useEffect(() => {
  
    fetch(`http://localhost:8070/api/employees?page=${currentPage}&limit=${limit}&departement=${filterDepartment}&status=${filterStatus}`)
      .then((res) => {
        console.log("Réponse du serveur :", res);
        return res.json();
      })
      .then((data) => {
        console.log("Données reçues :", data);
        setEmployees(data.employees);
        setFilteredEmployees(data.employees);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des employés :", error);
        setLoading(false);
      });
  }, [currentPage, importing, filterDepartment, filterStatus]);

  if (loading) {
    return <div>Chargement...</div>;
  }


  return (
    <React.Fragment>
      <div className="buttons">
        <h1>Employees</h1> 
          {(currentUser.role ==="ADMIN_HR" || currentUser.role ==="MEMBRE_HR" || currentUser.role ==="SUPER_ADMIN" ) && <><Link to="add" className="link">
                  <Add/>
                    Add employee
          </Link>
          <div className="excel-Button">
                <div className="file-upload">
                  <ArrowCircleUp className="upload-icon" />
                  <span>Upload users from excel file</span>
                  <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                </div>
          </div></>}

      </div>
        
        


<Col sm={12}>
   <Card className="mt-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Header className="py-4 text-center border-bottom-0 position-relative">
  <Card.Title 
    as="h2" 
    className="mb-0 position-relative d-inline-block"
    style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: '#2d3748',
      padding: '0 2rem'
    }}
  >
  </Card.Title>
</Card.Header>
                <div className="d-flex gap-3">
                  <Form.Control
                    type="text"
                    placeholder="Search users..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    style={{ width: '250px' }}
                  />
                  <Form.Select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '200px' }}
                  >
                    <option value="firstname">Sort by FirstName</option>
                    <option value="lastname">Sort by LastName</option>
                  </Form.Select>
                  <Form.Select value={filterDepartment} onChange={(e) => {setFilterDepartment(e.target.value)}}>
                    <option value="ALL">All Departments</option>
                    <option value="Empty" >With no departement</option>
                    {departements.map((dept, index)=>(
                        <option value={dept._id} key={index} >{dept.name}</option>
                    ))}
                  </Form.Select>

                  <Form.Select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value)}}>
                    <option value="ALL">Filter by status</option>
                    <option value="Active" >Active</option>
                    <option value="Inactive" >Inactive</option>
                    <option value="Suspended" >Suspended</option>
                  </Form.Select>

                </div>
              </Card.Header>

              <Card.Body>
                <PerfectScrollbar>
                  <Table responsive hover className="custom-status-table">
                    <thead className="bg-light">
                      <tr>
                        {['firstname','lastname', 'mail', 'role', 'statut', 'Actions'].map((column) => (
                          <th 
                            key={column}
                            className={sortBy === column ? 'active-sort' : ''}
                            onClick={() => handleSort(column)}
                            style={{ cursor: 'pointer', minWidth: '150px' }}
                          >
                            {column.charAt(0).toUpperCase() + column.slice(1)}
                            {sortBy === column && (
                              <span className="ms-2">
                                {sortOrder === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees && filteredEmployees.map((user, index) => (
                        <tr key={index}>
                          <td className="align-middle">{user.firstname}</td>
                          <td className="align-middle">{user.lastname}</td>
                          <td className="align-middle">{user.email}</td>
                          <td className="align-middle text-capitalize">{user.role}</td>
                          <td className="align-middle">
                          <div 
                          
                            className= {`status-indicator ${
                              user.status==="Active" ? 'active' : 'inactive'
                            }`}

                            style={{
                              display: 'inline-block',
                            
                              width: '90px',
                              padding: '8px 12px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: 600, // Augmentation du poids de la police
                              transition: 'all 0.3s ease',
                              backgroundColor: user.status==="Active"
                                ? 'rgba(40, 167, 69, 0.15)' 
                                : 'rgba(220, 53, 69, 0.1)', // Rouge plus visible pour inactive
                              color: user.status==="Active"
                                ? '#28a745' 
                                : '#dc3545', // Couleur rouge pour inactive
                              border: `2px solid ${
                                user.status==="Active"  ? '#28a745' : 'rgba(220, 53, 69, 0.3)'
                              }`,
                              boxShadow: user.status==="Active"
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
                                background: user.status==="Active" 
                                  ? 'radial-gradient(circle, rgba(40,167,69,0.15) 0%, transparent 60%)' 
                                  : 'radial-gradient(circle, rgba(220,53,69,0.1) 0%, transparent 60%)',
                                pointerEvents: 'none'
                              }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span 
                                className="status-dot"
                                style={{
                                  display: 'inline-block',
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  marginRight: '8px',
                                  backgroundColor: user.status==="Active" 
                                    ? '#28a745' 
                                    : '#dc3545', // Rouge vif pour inactive
                                  boxShadow: user.status==="Active" 
                                    ? '0 0 8px rgba(40, 167, 69, 0.4)' 
                                    : '0 0 6px rgba(220, 53, 69, 0.3)',
                                  transform: 'translateZ(0)',
                                  position: 'relative'
                                }}
                              />
                              <span>
                                {user.status==="Active" ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="cellAction">
                          <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-view-user`}>
                                  View employee details
                                </Tooltip>
                              }
                            >
                              <div className="viewButton" onClick={() => handleView(user)}>
                                <Info />
                              </div>
                         </OverlayTrigger>

                            {(currentUser.role ==="ADMIN_HR" || currentUser.role ==="MEMBRE_HR" || currentUser.role ==="SUPER_ADMIN" ) && 
                                <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-edit-user`}>
                                    Edit employee
                                  </Tooltip>
                                }
                              >
                                <div className="editButton" onClick={() => handleModifier(user)}>
                                  <EditNote />
                                </div>
                              </OverlayTrigger>
                              }
                              {user.departement==null && (
                                <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-add-to-department`}>
                                    Add to department
                                  </Tooltip>
                                }
                              >
                                <div className="groupButton" onClick={() => handleAddToDepartement(user)}>
                                  <GroupAdd />
                                </div>
                              </OverlayTrigger>
                              )}
                            {(currentUser.role ==="ADMIN_HR" || currentUser.role ==="MEMBRE_HR" || currentUser.role ==="SUPER_ADMIN" ) && <div className="deleteButton" onClick={()=>handleDelete(emp._id)}>
                              <DeleteForever/>
                            </div>}
                          </div>
                        </td>
                      </tr>
              ))}
            </tbody>
          </Table>
        </PerfectScrollbar>
        <Pagination className="justify-content-center mt-3">
            <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} />
            {[...Array(totalPages).keys()].map(number => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} />
          </Pagination>
      </Card.Body>
    </Card>
  </Col>
                      {showAlert && (
                                    <ConfirmationAlert
                                    message="Are you sure to add this list of users?"
                                    onConfirm={()=>handleConfirm()}
                                    onCancel={handleCancel}
                                    />
                                )}
                              {importing && (
                                    <ConfirmationAlert
                                    message="loading..."
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
                                    type="departement"
                                    onConfirm={()=>AddToDepartement()}
                                    onCancel={handleCancel}
                                    />
                                )}
                      

    </React.Fragment>
  );
};

export default Employees;

