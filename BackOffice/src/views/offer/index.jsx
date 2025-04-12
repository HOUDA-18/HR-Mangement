import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { skillsOptions } from 'skillOptions';
import { AuthContext } from '../../contexts/authContext';
import { FaEdit, FaPlus, FaMinus, FaTimes, FaCheck, FaBan, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [rejectingOfferId, setRejectingOfferId] = useState(null);
    const navigate = useNavigate()
    const viewDetails = (id) => {
      navigate(`/app/dashboard/candidatures`, { state: { values: id } });
    };
  //////
  const [showCandidatures, setShowCandidatures] = useState(false);
const [currentOfferCandidatures, setCurrentOfferCandidatures] = useState([]);
const [selectedOfferId, setSelectedOfferId] = useState(null);
  //////
  const { user, role } = useContext(AuthContext);
  const itemsPerPage = 3;

  const isAdminOrSuperAdmin = () => {
    return role === 'ADMIN_HR' || role === 'HEAD_DEPARTEMENT';
  };
///////
const fetchCandidatures = async (offerId) => {
  try {
    const response = await axios.get(`http://localhost:8070/api/candidatures/offer/${offerId}`);
    setCurrentOfferCandidatures(response.data);
    setSelectedOfferId(offerId);
    setShowCandidatures(true);
  } catch (err) {
    console.error('Error fetching candidatures:', err);
    alert('Failed to fetch candidatures');
  }
};
///////
  const updateNumberOfPositions = async (offerId, delta) => {
    try {
      const response = await axios.put(
        `http://localhost:8070/api/offre/${offerId}/positions`,
        { delta }
      );
      
      setOffers(prev => 
        prev.map(offer => 
          offer._id === offerId ? { ...offer, numberofplace: response.data.numberofplace } : offer
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error('Error updating positions:', err);
      alert(err.response?.data?.message || 'Failed to update positions');
    }
  };

  const handleApply = (offerId) => {
    // Redirection vers la page de candidature ou traitement API
    window.location.href = `/apply/${offerId}`;
    // Ou: 
    // axios.post(`/api/offers/${offerId}/apply`, { userId: user._id })
    //   .then(response => alert("Candidature envoyée!"))
    //   .catch(error => console.error(error));
  };
 
  useEffect(() => {
    axios
      .get('http://localhost:8070/api/offre/all')
      .then((response) => {
        setOffers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching offers:', err);
        setError('Failed to fetch offers');
        setLoading(false);
      });
  }, []);

  const updateOfferStatus = async (offerId, newStatus, comment = '') => {
    try {
      const payload = { status: newStatus };
      if (newStatus === 'REJECTED') {
        payload.comment = comment;
      }

      await axios.put(`http://localhost:8070/api/offre/${offerId}/status`, payload);
      
      setOffers(prev =>
        prev.map(offer =>
          offer._id === offerId ? { 
            ...offer, 
            status: newStatus,
            commentaire: newStatus === 'REJECTED' ? comment : offer.commentaire 
          } : offer
        )
      );
      
      setRejectingOfferId(null);
      setRejectionComment('');
    } catch (err) {
      console.error('Error updating offer status:', err);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const statusMatch = statusFilter === 'all' || offer.status === statusFilter;
    const departmentMatch = 
      departmentFilter === 'all' || 
      (offer.departement?.name?.toLowerCase() === departmentFilter.toLowerCase());
    return statusMatch && departmentMatch;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="offers-container">
      <h1 className="page-title">Offers Management</h1>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select 
            id="status-filter"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="department-filter">Department:</label>
          <select 
            id="department-filter"
            value={departmentFilter} 
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Departments</option>
            {[...new Set(offers
              .map((o) => o.departement?.name)
              .filter(name => name !== undefined)
            )].map((dept, i) => (
              <option key={i} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="offers-list">
        {currentOffers.length > 0 ? (
          currentOffers.map((offer, index) => (
            <div key={index} className={`offer-card ${offer.status?.toLowerCase()}`}>
              <div className="card-header">
                <h3 className="offer-title">{offer.title}</h3>
                <span className={`status-badge ${offer.status?.toLowerCase()}`}>
                  {offer.status}
                </span>
              </div>
              
              <div className="card-body">
                <p className="offer-description">{offer.description}</p>
                
                <div className="offer-details">
                  <div className="detail-row">
                    <span className="detail-label">Number of positions:</span>
                    {editingId === offer._id ? (
                      <div className="number-control">
                        <button 
                          onClick={() => updateNumberOfPositions(offer._id, -1)}
                          className="control-btn minus"
                          disabled={offer.numberofplace <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="number-value">{offer.numberofplace}</span>
                        <button 
                          onClick={() => updateNumberOfPositions(offer._id, 1)}
                          className="control-btn plus"
                        >
                          <FaPlus />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="control-btn cancel"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="number-display">
                        <span className="number-value">{offer.numberofplace}</span>
                        {isAdminOrSuperAdmin() && (
                          <button 
                            onClick={() => setEditingId(offer._id)}
                            className="edit-btn"
                          >
                            <FaEdit /> Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Contract Type:</span>
                    <span className="detail-value">{offer.typeContrat}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Education Level:</span>
                    <span className="detail-value">{offer.niveaudetude}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Years of Experience:</span>
                    <span className="detail-value">{offer.anneeexperience}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Offer Date:</span>
                    <span className="detail-value">
                      {new Date(offer.dateOffre).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {offer?.skills?.length > 0 && (
                  <div className="skills-section">
                    <h4 className="skills-title">Required Skills:</h4>
                    <div className="skills-list">
                      {offer.skills.map((skill, idx) => {
                        const skillData = skillsOptions.find((s) => s.name === skill);
                        return (
                          <div key={idx} className="skill-item">
                            {skillData ? (
                              <>
                                <img src={skillData.image} alt={skillData.name} title={skillData.name} />
                                <span>{skillData.name}</span>
                              </>
                            ) : (
                              <span>{skill}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
   <button 
  onClick={() => viewDetails(offer._id)} // Navigation simple sans paramètre
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
>
  Candidatures
</button>
                  </div>
                  
                )}

                {offer.commentaire && offer.status === 'REJECTED' && (
                  <div className="rejection-comment">
                    <strong>Rejection Reason:</strong> 
                    <p>{offer.commentaire}</p>
                  </div>
                )}
              </div>

              {offer.status === 'PENDING' && isAdminOrSuperAdmin() && (
                <div className="card-footer">
                  {rejectingOfferId === offer._id ? (
                    <div className="rejection-form">
                      <textarea
                        value={rejectionComment}
                        onChange={(e) => setRejectionComment(e.target.value)}
                        placeholder="Enter detailed rejection reason..."
                        className="rejection-textarea"
                      />
                      <div className="rejection-actions">
                        <button 
                          onClick={() => updateOfferStatus(offer._id, 'REJECTED', rejectionComment)}
                          className="action-btn confirm-reject"
                        >
                          <FaBan /> Confirm Rejection
                        </button>
                        <button 
                          onClick={() => {
                            setRejectingOfferId(null);
                            setRejectionComment('');
                          }}
                          className="action-btn cancel"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pending-actions">
                      <button 
                        onClick={() => updateOfferStatus(offer._id, 'ACCEPTED')}
                        className="action-btn accept"
                      >
                        <FaCheck /> Accept Offer
                      </button>
                      <button 
                        onClick={() => setRejectingOfferId(offer._id)}
                        className="action-btn reject"
                      >
                        <FaBan /> Reject Offer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-offers">
            <p>No offers match your filters.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          {showCandidatures && (
  <div className="candidatures-modal">
    <div className="modal-content">
      <div className="modal-header">
        <h3>Candidatures pour l'offre</h3>
        <button 
          onClick={() => setShowCandidatures(false)}
          className="close-btn"
        >
          &times;
        </button>
      </div>
      
      
    </div>
  </div>
)}
        </div>
      )}

      <style jsx>{`
        .offers-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .page-title {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 30px;
          font-weight: 600;
        }
        
        .filters-container {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .filter-select {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #ddd;
          background-color: white;
          font-size: 14px;
          min-width: 200px;
        }
        
        .offers-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }
        
        .offer-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .offer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
        
        .card-header {
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .offer-title {
          margin: 0;
          color: #2c3e50;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-badge.pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-badge.accepted {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-badge.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .card-body {
          padding: 20px;
          flex-grow: 1;
        }
        
        .offer-description {
          color: #555;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        
        .offer-details {
          margin-bottom: 20px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .detail-label {
          color: #666;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .detail-value {
          color: #333;
          font-weight: 600;
        }
        
        .number-display {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .number-value {
          font-weight: 600;
          color: #2c3e50;
          min-width: 30px;
          text-align: center;
        }
        
        .edit-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .edit-btn:hover {
          background-color: #2980b9;
        }
        
        .number-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .control-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        
        .control-btn.plus {
          background-color: #2ecc71;
          color: white;
        }
        
        .control-btn.plus:hover {
          background-color: #27ae60;
        }
        
        .control-btn.minus {
          background-color: #e74c3c;
          color: white;
        }
        
        .control-btn.minus:hover {
          background-color: #c0392b;
        }
        
        .control-btn.minus:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .control-btn.cancel {
          background-color: #95a5a6;
          color: white;
          margin-left: 10px;
        }
        
        .control-btn.cancel:hover {
          background-color: #7f8c8d;
        }
        
        .skills-section {
          margin-top: 20px;
        }
        
        .skills-title {
          color: #2c3e50;
          font-size: 1rem;
          margin-bottom: 10px;
        }
        
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-item {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background-color: #f0f0f0;
          border-radius: 15px;
          font-size: 0.8rem;
        }
        
        .skill-item img {
          width: 16px;
          height: 16px;
          object-fit: contain;
        }
        
        .rejection-comment {
          margin-top: 20px;
          padding: 10px;
          background-color: #f8f9fa;
          border-left: 3px solid #e74c3c;
          border-radius: 0 4px 4px 0;
        }
        
        .rejection-comment strong {
          color: #e74c3c;
        }
        
        .rejection-comment p {
          margin: 5px 0 0;
          color: #555;
        }
        
        .card-footer {
          padding: 15px 20px;
          background-color: #f8f9fa;
          border-top: 1px solid #eee;
        }
        
        .pending-actions {
          display: flex;
          gap: 10px;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .action-btn.accept {
          background-color: #2ecc71;
          color: white;
        }
        
        .action-btn.accept:hover {
          background-color: #27ae60;
        }
        
        .action-btn.reject {
          background-color: #e74c3c;
          color: white;
        }
        
        .action-btn.reject:hover {
          background-color: #c0392b;
        }
        
        .action-btn.confirm-reject {
          background-color: #e74c3c;
          color: white;
        }
        
        .action-btn.cancel {
          background-color: #95a5a6;
          color: white;
        }
        
        .rejection-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .rejection-textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-height: 80px;
          resize: vertical;
        }
        
        .rejection-actions {
          display: flex;
          gap: 10px;
        }
        
        .apply-btn {
          width: 100%;
          padding: 10px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .apply-btn:hover {
          background-color: #2980b9;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          gap: 5px;
          margin-top: 30px;
        }
        
        .page-btn {
          padding: 8px 15px;
          border: 1px solid #ddd;
          background-color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .page-btn:hover {
          background-color: #f0f0f0;
        }
        
        .page-btn.active {
          background-color: #3498db;
          color: white;
          border-color: #3498db;
        }
        
        .no-offers {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: #666;
        }
        
        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
        }
        
        .error {
          color: #e74c3c;
        }
        
        @media (max-width: 768px) {
          .offers-list {
            grid-template-columns: 1fr;
          }
          
          .filters-container {
            flex-direction: column;
          }
          
          .pending-actions, .rejection-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Offers;