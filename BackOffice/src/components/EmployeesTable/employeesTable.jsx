import { Add, AdminPanelSettings, ArrowCircleUp,  DeleteForever, EditNote, GroupAdd, GroupRemove, Info, PersonAddAlt } from '@mui/icons-material';
import axios from 'axios';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  Col, Card, Table,Form, Button, Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';


import AffectationAlert from 'components/AffectAlert/affectation';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const EmployeesTable = ({departementID}) => {
  const [filterText, setFilterText] = useState('');

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState('');  
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [showAlertAffectation, setShowAlertAffectation] = useState(false);
  const [showAlertMakeHead, setShowAlertMakeHead] = useState(false);
  const [employeeToAffect, setEmployeeToAffect]= useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [deleteId, setDeleteId]= useState('')
  const [sortOrder, setSortOrder] = useState('asc');

  const currentUser = JSON.parse(localStorage.getItem("user"))

  const navigate = useNavigate()



  const handleCancel = ()=>{
    setShowAlert(false)
    setShowAlertDelete(false)
    setShowAlertAffectation(false)
    setShowAlertMakeHead(false)
  }

  const handleAddToTeam = (emp)=>{
    setEmployeeToAffect(emp)
    setShowAlertAffectation(true)
}

  const  handleMakeHeadDepartement = (emp)=>{
    axios.post(`http://localhost:8070/api/departements/assignChefDepartement/${departementID}/${emp._id}`)
    .then(()=>{
       window.location.reload();
    }).catch((err)=>{
       console.log("error:",err)
    })
 }


  const handleExitDepartement = (id)=>{
    setEmployees(employees.filter((emp)=>emp._id!=id))
    axios.put(`http://localhost:8070/api/departements/detachEmployee/${departementID}/${id}`)
    .then((res)=>{
       console.log("success: ",res)
       setShowAlertDelete(false)
    }).catch((err)=>{
       console.log("error:",err)
    })
  }




    const  handleView= (emp)=>{
      navigate(`/app/dashboard/employees/employeeDetails`,{state:{ values: emp._id}})
    }

    const  handleDelete= (id)=>{
      setShowAlertDelete(true)
      setDeleteId(id)
    }

    const makeHead = (emp)=>{
      setShowAlertMakeHead(true)
      setEmployeeToAffect(emp)
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
  
    fetch(`http://localhost:8070/api/departements/${departementID}?page=${currentPage}&limit=${limit}&status=${filterStatus}`)
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
  }, [currentPage, filterStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <React.Fragment> 
        
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
    List of employees
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
                      {filteredEmployees!=[] && filteredEmployees.map((user, index) => (
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
                         {(user.role!="ADMIN_HR" || user.role!="HEAD_DEPARTEMENT" )&& (currentUser.role ==="SUPER_ADMIN" ||currentUser.role ==="ADMIN_HR" || currentUser.role ==="MEMBRE_HR"  ) && 
                                ( <div className="editButton" onClick={()=>makeHead(user)}>
                                    <AdminPanelSettings/>
                                    </div>
                                    )
                          }
                            {( currentUser.role ==="SUPER_ADMIN" || currentUser.role ==="HEAD_DEPARTEMENT"  ) && 
                                <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-edit-user`}>
                                    Add to a Team
                                  </Tooltip>
                                }
                              >
                                <div className="editButton" onClick={()=>handleAddToTeam(user)}>
                                  <PersonAddAlt />
                                </div>
                              </OverlayTrigger>
                              }
                              
                            {( currentUser.role ==="SUPER_ADMIN" || currentUser.role ==="HEAD_DEPARTEMENT"  ) && 
                                <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-edit-user`}>
                                    Remove from the departement
                                  </Tooltip>
                                }
                              >
                                <div className="deleteButton" onClick={()=>handleDelete(user._id)}>
                                  <GroupRemove/>
                                </div>
                              </OverlayTrigger>
                            }
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
                    

                      {showAlertDelete && (
                                    <ConfirmationAlert
                                    message="Are you sure to remove this employee from the departement?"
                                    onConfirm={()=>handleExitDepartement(deleteId)}
                                    onCancel={handleCancel}
                                    />
                                )}

                      {showAlertAffectation && (
                                    <AffectationAlert
                                    message="Please select a team"
                                    data={employeeToAffect}
                                    type="team"
                                    onConfirm={()=>AddToTeam()}
                                    onCancel={handleCancel}
                                    />
                                )}
                        {showAlertMakeHead && (
                                    <ConfirmationAlert
                                    message="Are you sure to make this employee head of departement?"
                                    onConfirm={()=>handleMakeHeadDepartement(employeeToAffect)}
                                    onCancel={handleCancel}
                                    />
                                )}
                      

    </React.Fragment>
  );
};

export default EmployeesTable;

