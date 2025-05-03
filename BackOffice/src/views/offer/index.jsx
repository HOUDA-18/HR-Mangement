import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { skillsOptions } from 'skillOptions';
import { AuthContext } from '../../contexts/authContext';
import { FaEdit, FaPlus, FaMinus, FaTimes, FaCheck, FaBan, FaFileAlt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './offer.scss'
import { PiLockKeyFill } from "react-icons/pi";

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
    return role === 'ADMIN_HR' || role === 'SUPER_ADMIN';
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

  const closeOffer = async (offre)=>{
      await axios.put(`http://localhost:8070/api/offer/${offre._id}`)
                      .then((res)=>{
                          console.log("res:",res)
                          setOffers(prev =>
                            prev.map(offer =>
                              offer._id === offre._id ? { 
                                ...offer, 
                                status: "CLOSED"
                              } : offer
                            )
                          );
                      }).catch((err)=>{
                        console.log("err:",err)
                      })
  }

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
      (offer.departementName?.toLowerCase() === departmentFilter.toLowerCase());
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

        <div className="filters-card">
          <div className="filters-grid">
            {/* Status Filter */}
            <div className="filter-item">
              <label htmlFor="status-filter">Filter by Status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="filter-item">
              <label htmlFor="department-filter">Filter by Department</label>
              <select
                id="department-filter"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {[...new Set(
                  offers.map((o) => o.departement?.name).filter(Boolean)
                )].map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
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
                        {(isAdminOrSuperAdmin() && offer.status=="PENDING" )&& (
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
                      {(offer.status === 'PENDING' ) && <>
                      <button 
                        onClick={() => updateOfferStatus(offer._id, 'ACCEPTED')}
                        className="action-btnn accept"
                      >
                        <FaCheck /> Accept Offer
                      </button>
                      <button 
                        onClick={() => setRejectingOfferId(offer._id)}
                        className="action-btnn reject"
                      >
                        <FaBan /> Reject Offer
                      </button>
                      </>}
                      {(offer.status === 'ACCEPTED' ) && 
                      <button 
                        onClick={() => viewDetails(offer._id)}
                        className="action-btnn details"
                      >
                        <FaArrowRight /> Details
                      </button>}
                    </div>
                  )} 
                  
                </div>
              )}

                {((offer.status === 'ACCEPTED'|| offer.status === 'CLOSED') && isAdminOrSuperAdmin())  && 
                  ( <div className="card-footer">
                  <div className="pending-actions">                    
                      <button 
                        onClick={() => viewDetails(offer)}
                        className="action-btnn details"
                      >
                        <FaArrowRight /> Details
                      </button>
                      

                      <button 
                        onClick={() => closeOffer(offer)}
                        className="action-btnn close-offer"
                        disabled={['CLOSED'].includes(offer.status)}
                      >
                        <PiLockKeyFill /> Close Offer
                      </button>
                    </div>
                    </div>)}
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
        </div>
      )}

    </div>
  );
};

export default Offers;