import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './offer.scss';
import { skillsOptions } from 'skillOptions';
import { AuthContext } from '../../contexts/authContext'; // Chemin corrigé


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
  
  const { user, role } = useContext(AuthContext);
  const itemsPerPage = 3;

  const isAdminOrSuperAdmin = () => {
    return role === 'ADMIN_HR' || role === 'SUPER_ADMIN';
  };

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
    const statusMatch = statusFilter === 'all' || offer.status?.toLowerCase() === statusFilter;
    const departmentMatch = 
      departmentFilter === 'all' || 
      (offer.departement?.name?.toLowerCase() === departmentFilter.toLowerCase());
    return statusMatch && departmentMatch;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <React.Fragment>
      <h1>Offers</h1>

      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">ACCEPTED</option>
          <option value="rejected">REJECTED</option>
        </select>

        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
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

      <div className="offers-list">
        {currentOffers.length > 0 ? (
          currentOffers.map((offer, index) => (
            <div key={index} className="offer-card">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <div className="items">
                <h6>Number of positions:</h6>
                <span>{offer.numberofplace}</span>
                {editingId === offer._id ? (
                  <div className="number-controls">
                    <button 
                      onClick={() => updateNumberOfPositions(offer._id, -1)}
                      className="edit-btn"
                    >
                      -
                    </button>
                    <span>{offer.numberofplace}</span>
                    <button 
                      onClick={() => updateNumberOfPositions(offer._id, 1)}
                      className="edit-btn"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="number-display">
                    <span>{offer.numberofplace}</span>
                    {isAdminOrSuperAdmin() && (
                      <button 
                        onClick={() => setEditingId(offer._id)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="items">
                <h6>Contract Type:</h6>
                <span>{offer.typeContrat}</span>
              </div>

              <div className="items">
                <h6>Education Level:</h6>
                <span>{offer.niveaudetude}</span>
              </div>

              <div className="items">
                <h6>Years of Experience:</h6>
                <span>{offer.anneeexperience}</span>
              </div>

              {offer?.skills?.length > 0 && (
                <div className="offer-skills">
                  <h4>Skills:</h4>
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

              <p>Offer Date: {new Date(offer.dateOffre).toLocaleDateString()}</p>

              {offer.commentaire && offer.status === 'REJECTED' && (
                <div className="rejection-comment">
                  <strong>Rejection Reason:</strong> {offer.commentaire}
                </div>
              )}

              <div className={`offer-status-badge ${offer.status?.toLowerCase()}`}>
                {offer.status}
              </div>

              {offer.status === 'PENDING' && isAdminOrSuperAdmin() && (
                <div className="offer-actions">
                  <button onClick={() => updateOfferStatus(offer._id, 'ACCEPTED')}>
                    Accept
                  </button>
                  
                  {rejectingOfferId === offer._id ? (
                    <div className="rejection-form">
                      <textarea
                        value={rejectionComment}
                        onChange={(e) => setRejectionComment(e.target.value)}
                        placeholder="Enter rejection reason..."
                      />
                      <button 
                        onClick={() => updateOfferStatus(offer._id, 'REJECTED', rejectionComment)}
                        className="confirm-reject-btn"
                      >
                        Confirm Rejection
                      </button>
                      <button 
                        onClick={() => {
                          setRejectingOfferId(null);
                          setRejectionComment('');
                        }}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setRejectingOfferId(offer._id)}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No offers match your filters.</p>
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            className={currentPage === idx + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Offers;