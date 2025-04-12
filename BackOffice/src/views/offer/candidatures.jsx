import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { FaBan, FaCheck, FaFilePdf, FaLinkedin, FaGithub, FaFileUpload, FaUserTie, FaEnvelope, FaPhone, FaCode, FaChartLine, FaCalendarAlt, FaSort, FaSortUp, FaSortDown, FaInfo, FaRegAddressBook, FaRegFolderOpen } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import axios from "axios";
import { AuthContext } from "contexts/authContext";

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
        <h2>Candidatures pour l'offre {offre.title}</h2>
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
            className="stat accepted"
            onClick={() => {
              setSortedCandidatures(candidatures.filter(c => c.status === 'ACCEPTED'));
              setCurrentPage(1);
            }}
          >
            {candidatures.filter(c => c.status === 'ACCEPTED').length} Acceptées
          </button>
          <button 
            className="stat pending"
            onClick={() => {
              setSortedCandidatures(candidatures.filter(c => c.status === 'PENDING'));
              setCurrentPage(1);
            }}
          >
            {candidatures.filter(c => c.status === 'PENDING').length} En Attente
          </button>
          <button 
            className="stat rejected"
            onClick={() => {
              setSortedCandidatures(candidatures.filter(c => c.status === 'REJECTED'));
              setCurrentPage(1);
            }}
          >
            {candidatures.filter(c => c.status === 'REJECTED').length} Rejetées
          </button>
        </div>
      </div>

      <div className="candidatures-list">
        {sortedCandidatures.length > 0 ? (
          <>
            <table className="candidatures-table">
              <thead>
                <tr>
                  <th><FaUserTie /> Nom</th>
                  <th><FaUserTie /> Prénom</th>
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
                  <th>Statut</th>
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
                        {candidature.status === 'ACCEPTED' ? 'Accepté' : 
                         candidature.status === 'REJECTED' ? 'Rejeté' : 'En attente'}
                      </span>
                    </td>
                    <td>
                     {(role==="ADMIN_HR" && candidature.status==="PENDING" ) &&  
                     <div className="action-buttons">
                        <button 
                          className="action-btn accept"
                          disabled={candidature.status === 'ACCEPTED'}
                          onClick={() => handleUpdateStatus(candidature._id, 'ACCEPTED')}
                          title="Accepter la candidature"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="action-btn reject"
                          disabled={candidature.status === 'REJECTED'}
                          onClick={() => handleUpdateStatus(candidature._id, 'REJECTED')}
                          title="Rejeter la candidature"
                        >
                          <FaBan />
                        </button>
                        <button 
                          className="action-btn details"
                          onClick={() => handleDetails(candidature._id)}
                          title="Application details"
                        >
                          <FaInfo />
                        </button>
                      </div>}
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

      <style jsx>{`
        .stats button {
          border: none;
          background: none;
          cursor: pointer;
          padding: 5px 10px;
          margin: 0 5px;
          border-radius: 4px;
        }

        .stats button:hover {
          background-color: #f0f0f0;
        }

        .stat.total { color: #333; }
        .stat.accepted { color: #28a745; }
        .stat.pending { color: #ffc107; }
        .stat.rejected { color: #dc3545; }

        .candidatures-container {
          padding: 25px;
          max-width: 100%;
          overflow-x: auto;
          background-color: #f9fafb;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .candidatures-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .candidatures-header h2 {
          color: #2d3748;
          font-size: 1.5rem;
          margin: 0;
        }

        .stats {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .stat {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .stat.total {
          background-color: #e2e8f0;
          color: #4a5568;
        }

        .stat.accepted {
          background-color: #e6fffa;
          color: #38b2ac;
        }

        .stat.pending {
          background-color: #feebc8;
          color: #dd6b20;
        }

        .stat.rejected {
          background-color: #fed7d7;
          color: #e53e3e;
        }

        .candidatures-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 10px;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .candidatures-table th {
          background-color: #edf2f7;
          color: #4a5568;
          font-weight: 600;
          padding: 15px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .candidatures-table th svg {
          margin-right: 8px;
          vertical-align: middle;
        }

        .candidatures-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        .candidature-row:hover {
          background-color: #f8fafc !important;
        }

        .candidature-row.accepted {
          background-color: #f0fff4;
        }

        .candidature-row.rejected {
          background-color: #fff5f5;
          opacity: 0.8;
        }

        .email-link, .phone-link {
          color: #3182ce;
          text-decoration: none;
          transition: color 0.2s;
        }

        .email-link:hover, .phone-link:hover {
          color: #2c5282;
          text-decoration: underline;
        }

        .skills-cell {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .skill-tag {
          background-color: #ebf8ff;
          color: #3182ce;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          white-space: nowrap;
        }

        .score-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .score-bar {
          height: 6px;
          background-color: #4299e1;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .score-value {
          font-weight: 500;
          color: #2d3748;
        }

        .cv-link, .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 4px;
          transition: all 0.2s;
          position: relative;
          gap: 5px;
        }

        .cv-link {
          background-color: #ebf8ff;
          color: #3182ce;
        }

        .social-link.linkedin {
          background-color: #e3f2fd;
          color: #0A66C2;
        }

        .social-link.github {
          background-color: #f0f0f0;
          color: #181717;
        }

        .cv-link:hover, .social-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .external-icon {
          opacity: 0.7;
        }

        .status-badge {
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
          display: inline-block;
          min-width: 80px;
          text-align: center;
        }

        .status-badge.accepted {
          background-color: #e6fffa;
          color: #38b2ac;
        }

        .status-badge.rejected {
          background-color: #fff5f5;
          color: #e53e3e;
        }

        .status-badge.pending {
          background-color: #fffaf0;
          color: #dd6b20;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          border: none;
          border-radius: 4px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          width: 32px;
          height: 32px;
        }

        .action-btn.accept {
          background-color: #e6fffa;
          color: #38b2ac;
        }

        .action-btn.accept:hover:not(:disabled) {
          background-color: #38b2ac;
          color: white;
        }

        .action-btn.reject {
          background-color: #fff5f5;
          color: #e53e3e;
        }

        .action-btn.details {
          background-color: rgb(75, 168, 205);;
          color: white;
        }

        .action-btn.reject:hover:not(:disabled) {
          background-color: #e53e3e;
          color: white;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-candidatures {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .no-candidatures img {
          width: 120px;
          height: 120px;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .no-candidatures p {
          color: #718096;
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        .refresh-btn {
          background-color: #4299e1;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .refresh-btn:hover {
          background-color: #3182ce;
        }

        /* Pagination styles */
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          gap: 5px;
        }

        .pagination-button {
          border: 1px solid #ddd;
          background-color: white;
          color: #3182ce;
          padding: 8px 12px;
          margin: 0 2px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
        }

        .pagination-button:hover:not(:disabled) {
          background-color: #ebf8ff;
          border-color: #3182ce;
        }

        .pagination-button:disabled {
          color: #ccc;
          cursor: not-allowed;
          background-color: #f9f9f9;
        }

        .pagination-button.active {
          background-color: #3182ce;
          color: white;
          border-color: #3182ce;
        }

        .pagination-button.first-last {
          padding: 8px;
        }

        @media (max-width: 1200px) {
          .candidatures-table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
        }

        @media (max-width: 768px) {
          .candidatures-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .stats {
            width: 100%;
            justify-content: space-between;
          }

          .pagination-container {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Candidatures;