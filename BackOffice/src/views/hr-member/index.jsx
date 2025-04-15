import { AdminPanelSettings, Info, PersonOff } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './index.scss'
import { useNavigate } from 'react-router-dom';
import PdfUpload from 'components/pdfUpload/pdfUpload';
const HRMembers = () => {
  const [hrMembers, setHRMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 2;
  const navigate = useNavigate()

  const  handleMakeHeadDepartement = (emp, idDept)=>{
    axios.post(`http://localhost:8070/api/departements/assignChefDepartement/${idDept}/${emp._id}`)
    .then(()=>{
       window.location.reload();
    }).catch((err)=>{
       console.log("error:",err)
    })
 }

 const handleExitDepartement = (id, idDept)=>{
   axios.put(`http://localhost:8070/api/departements/detachEmployee/${idDept}/${id}`)
   .then((res)=>{
      window.location.reload();
   }).catch((err)=>{
      console.log("error:",err)
   })
 }
 const  handleView= (emp)=>{
  navigate(`/app/dashboard/employees/employeeDetails`,{state:{ values: emp._id}})
}
  useEffect(() => {
    axios.get(`http://localhost:8070/api/HRmembers?page=${currentPage}&limit=${limit}`)
      .then((res) => {
        console.log(res)
        console.log("Données RH reçues :", res);
        setHRMembers(res.data.rhMembers); 
        setTotalPages(res.data.totalPages)
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des membres RH :", error);
        setLoading(false);
      });
  }, [currentPage]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Chargement...</div>;
  }

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start', 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f5f6fa',
      minHeight: '100vh',
      paddingTop: '10px' 
    }}>
      <div style={{ 
        width: '100%',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '0 auto' 
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
         List of HR members
        </h1>

        {hrMembers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#7f8c8d',
            fontStyle: 'italic'
          }}>
            Aucun membre RH trouvé
          </div>
        ) : (
          <div style={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#ffffff'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#007bff',
                  color: 'white'
                }}>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '500',
                    fontSize: '16px'
                  }}>FirstName</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '500',
                    fontSize: '16px'
                  }}> LastName</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '500',
                    fontSize: '16px'
                  }}> Email</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '500',
                    fontSize: '16px'
                  }}> Role</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '500',
                    fontSize: '16px'
                  }}> Actions</th>
                </tr>
              </thead>
              <tbody>
                {hrMembers.map((member, index) => (
                  <tr 
                    key={member._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                      transition: 'background-color 0.2s',
                      borderBottom: '1px solid #e9ecef'
                    }}
                  >
                    <td style={{
                      padding: '15px',
                      color: '#2c3e50',
                      fontSize: '14px'
                    }}>{member.firstname}</td>
                    <td style={{
                      padding: '15px',
                      color: '#2c3e50',
                      fontSize: '14px'
                    }}>{member.lastname}</td>
                    <td style={{
                      padding: '15px',
                      color: '#2c3e50',
                      fontSize: '14px'
                    }}>{member.email}</td>
                    <td style={{
                      padding: '15px',
                      color: '#2c3e50',
                      fontSize: '14px'
                    }}>{member.role}</td>
                    <td>
                                                    <div className="cellAction">
                                                        <div className="viewButton" onClick={()=>handleView(member)}>
                                                            <Info/>
                                                        </div>
                                                            {member.role!=="ADMIN_HR" &&
                                                                ( <div className="editButton" onClick={()=>handleMakeHeadDepartement(member, member.departement)}>
                                                                    <AdminPanelSettings />
                                                                    </div>
                                                                    )}
                                                        <div className="deleteButton" onClick={()=>handleExitDepartement(member._id, member.departement)}>
                                                            <PersonOff/>
                                                        </div>
                                                    </div>
                                                </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='pagination'>
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>
              <span className='page-info'> Page {currentPage} of {totalPages} </span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
{/*       <PdfUpload></PdfUpload>
 */}    </div>
  );
};

export default HRMembers;
