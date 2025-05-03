import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { FaBan, FaCheck, FaFilePdf, FaLinkedin, FaGithub, FaFileUpload, FaUserTie, FaEnvelope, FaPhone, FaCode, FaChartLine, FaCalendarAlt, FaSort, FaSortUp, FaSortDown, FaInfo, FaRegAddressBook, FaRegFolderOpen } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import axios from "axios";
import { AuthContext } from "contexts/authContext";
import { MdAssignmentAdd } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import './candidatures.scss'
const Candidatures = () => { 
  const navigate = useNavigate();
  const location = useLocation();
  const [candidatures, setCandidatures] = useState([]);
  const [sortedCandidatures, setSortedCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
  const offre = location.state?.values;
  const { user, role } = useContext(AuthContext);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchCandidatures = useCallback(async () => {
    console.log("user:", user)  
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8070/api/candidature/${offre._id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCandidatures(data);
      setSortedCandidatures(data); // Initialiser les données triées
    } catch (err) {
      console.error("Erreur lors de la récupération des candidatures :", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [offre._id]);

  const handleDownload = (pdfUrl) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'document.pdf';
    link.click();
  };

  const handleDetails = (cand)=>{
    navigate('/app/dashboard/candidatures/details', {state:{values: cand}})
  }

  const handleUpdateStatus = async (candidatureId, newStatus) => {
    try {
      // Mise à jour optimiste
      setCandidatures(prev => prev.map(c => 
        c._id === candidatureId ? { ...c, status: newStatus } : c
      ));
      setSortedCandidatures(prev => prev.map(c => 
        c._id === candidatureId ? { ...c, status: newStatus } : c
      ));

      axios.put(`http://localhost:8070/api/candidature/update-status/${candidatureId}`, {newStatus: newStatus})
        .then((res)=>{
          console.log("res: ",res)
        })
        .catch((err)=>{
          console.log("err: ", err)
        })
      
    } catch (error) {
      console.error("Erreur détaillée:", error);
      setError(error.message);
      fetchCandidatures(); // Recharger les données originales
    }
  };

  // Fonction de tri
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Effet pour trier les candidatures lorsque sortConfig change
  useEffect(() => {
    if (candidatures.length > 0) {
      const sortedItems = [...candidatures].sort((a, b) => {
        // Utilisez overallEvaluation.overallScore si disponible, sinon score normal
        const scoreA = a?.overallEvaluation?.overallScore || a.score || 0;
        const scoreB = b?.overallEvaluation?.overallScore || b.score || 0;

        if (scoreA < scoreB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (scoreA > scoreB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setSortedCandidatures(sortedItems);
      setCurrentPage(1); // Reset to first page when sorting changes
    }
  }, [sortConfig, candidatures]);

  useEffect(() => {
    fetchCandidatures();
  }, [fetchCandidatures]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCandidatures.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCandidatures.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des candidatures...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
          }
          .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur: {error}</p>
        <button onClick={fetchCandidatures}>Réessayer</button>
      </div>
    );
  }

  return ( 
    <div className="candidatures-container">
      <div className="candidatures-header">
        <h2>Applications made for offer <span>{offre.title}</span></h2>
        <div className="stats">
          <button 
            className="stat total"
            onClick={() => {
              setSortedCandidatures(candidatures);
              setCurrentPage(1);
            }}
          >
            {candidatures.length} Total
          </button>
          <button 
            className="stat shortlisted"
            onClick={() => {
              setSortedCandidatures(candidatures.filter(c => ['SHORTLISTED', 'AI_INTERVIEW_SCHEDULED', 'AI_INTERVIEW_PASSED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_PASSED'].includes(c.status)));
              setCurrentPage(1);
            }}
          >
            {candidatures.filter(c =>['SHORTLISTED', 'AI_INTERVIEW_SCHEDULED', 'AI_INTERVIEW_PASSED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_PASSED'].includes(c.status)).length} Shortlisted
          </button>
          <button 
            className="stat accepted"
            onClick={() => {
              setSortedCandidatures(candidatures.filter(c => c.status === 'ACCEPTED'));
              setCurrentPage(1);
            }}
          >
            {candidatures.filter(c => c.status === 'ACCEPTED').length} Accepted
          </button>
          <button 
            className="stat pending"
            onClick={() => {
              setSortedCandidatures(candidatures.filter(c => c.status === 'PENDING'));
              setCurrentPage(1);
            }}
          >
            {candidatures.filter(c => c.status === 'PENDING').length} Pending
          </button>
          <button 
            className="stat rejected"
            onClick={() => {
              setSortedCandidatures(candidatures.filter(c => c.status === 'REJECTED'));
              setCurrentPage(1);
            }}
          >
            {candidatures.filter(c => c.status === 'REJECTED').length} Rejected
          </button>
        </div>
      </div>

      <div className="candidatures-list">
        {sortedCandidatures.length > 0 ? (
          <>
            <table className="candidatures-table">
              <thead>
                <tr>
                  <th><FaUserTie /> Firstname</th>
                  <th><FaUserTie /> Lastname</th>
                  <th><FaEnvelope /> Email</th>
{/*                   <th><FaPhone /> Téléphone</th>
                  <th><FaCode /> Compétences</th>
  */}                 <th className="sortable-header" onClick={() => requestSort('score')}>
                    <div className="header-content">
                      <FaChartLine /> Score
                      <span className="sort-icon">
                        {getSortIcon('score')}
                      </span>
                    </div>
                  </th>
                  <th>Expérience</th>
{/*                   <th>CV</th>
                   <th>LinkedIn</th>
                  <th>GitHub</th>
 */}                 <th><FaCalendarAlt /> Date Of application</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((candidature) => (
                  <tr key={candidature._id} className={`candidature-row ${candidature.status.toLowerCase()}`}>
                    <td>{candidature.firstname}</td>
                    <td>{candidature.lastname}</td>
                    <td>
                      <a href={`mailto:${candidature.email}`} className="email-link">
                        {candidature.email}
                      </a>
                    </td>
{/*                     <td>
                      <a href={`tel:${candidature.phone}`} className="phone-link">
                        {candidature.phone}
                      </a>
                    </td> */}
{/*                     <td>
                      <div className="skills-cell">
                        {candidature.skills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </td> */}
                    <td>
                      <div className="score-container">
                        <div 
                          className="score-bar"
                          style={{ width: `${candidature?.overallEvaluation?.overallScore || candidature.score || 0}%` }}
                          title={`Score: ${candidature?.overallEvaluation?.overallScore || candidature.score || 0}/100`}
                        ></div>
                        <span className="score-value">{candidature?.overallEvaluation?.overallScore || candidature.score || 0}</span>
                      </div>
                    </td>
                    <td>{candidature?.anneeexperience || 0} ans</td>
{/*                     <td>
                      {candidature.cv && (
                        <button onClick={() => handleDownload(candidature.cv)}>
                          <FaFilePdf size={18} color="#e74c3c" />
                          <FiExternalLink size={12} className="external-icon" />
                        </button> 
                      )}
                    </td>
                    <td>
                      {candidature.lien_linkdin && (
                        <a 
                          href={candidature.lien_linkdin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-link linkedin"
                          title="Profil LinkedIn"
                        >
                          <FaLinkedin size={18} />
                          <FiExternalLink size={12} className="external-icon" />
                        </a>
                      )}
                    </td>
                    <td>
                      {candidature.lien_git && (
                        <a 
                          href={candidature.lien_git} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-link github"
                          title="Profil GitHub"
                        >
                          <FaGithub size={18} />
                          <FiExternalLink size={12} className="external-icon" />
                        </a>
                      )}
                    </td> */}
                    <td>{formatDate(candidature.dateApplication)}</td>
                    <td>
                      <span className={`status-badge ${candidature.status.toLowerCase()}`}>
                        {candidature.status === 'ACCEPTED' ? 'Accepted' : 
                        candidature.status === 'PENDING' ? 'Pending' : 
                         candidature.status === 'REJECTED' ? 'Rejected' :'Shortlisted'}
                      </span>
                    </td>
                    <td>
                    <div className="action-buttons">
                    <button 
                          className="action-btn details"
                          onClick={() => handleDetails(candidature._id)}
                          title="Application details"
                        >
                          <FaInfoCircle />
                        </button>
                     {(role==="ADMIN_HR" && candidature.status==="PENDING" ) &&  
                     <>
                        <button 
                          className="action-btn accept"
                          disabled={candidature.status === 'SHORTLISTED'}
                          onClick={() => handleUpdateStatus(candidature._id, 'SHORTLISTED')}
                          title="Shortlist Application"
                        >
                          <MdAssignmentAdd/>
                        </button>
                        <button 
                          className="action-btn reject"
                          disabled={candidature.status === 'REJECTED'}
                          onClick={() => handleUpdateStatus(candidature._id, 'REJECTED')}
                          title="Reject Application"
                        >
                          <FaBan />
                        </button>
                        
                        </>
                      }</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
  <div className="pagination-container">
    <button 
      onClick={goToFirstPage} 
      disabled={currentPage === 1}
      className="pagination-button first-last"
      title="Première page"
    >
      «
    </button>
    <button 
      onClick={goToPrevPage} 
      disabled={currentPage === 1}
      className="pagination-button"
      title="Page précédente"
    >
      ‹
    </button>
    
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
      <button
        key={number}
        onClick={() => paginate(number)}
        className={`pagination-button ${currentPage === number ? 'active' : ''}`}
      >
        {number}
      </button>
    ))}
    
    <button 
      onClick={goToNextPage} 
      disabled={currentPage === totalPages}
      className="pagination-button"
      title="Page suivante"
    >
      ›
    </button>
    <button 
      onClick={goToLastPage} 
      disabled={currentPage === totalPages}
      className="pagination-button first-last"
      title="Dernière page"
    >
      »
    </button>
  </div>
)}
          </>
        ) : (
          <div className="no-candidatures">
            <FaRegFolderOpen/>
            <p>Aucune candidature pour cette offre</p>
            <button className="refresh-btn" onClick={fetchCandidatures}>
              Actualiser
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Candidatures;