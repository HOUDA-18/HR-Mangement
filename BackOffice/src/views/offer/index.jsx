import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './offer.scss';
import { skillsOptions } from 'skillOptions';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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

  const updateOfferStatus = async (offerId, newStatus) => {
    try {
      await axios.put(`http://localhost:8070/api/offre/${offerId}`, {
        status: newStatus,
      });
      // Update local state
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status: newStatus } : offer
        )
      );
    } catch (err) {
      console.error('Error updating offer status:', err);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const statusMatch = statusFilter === 'all' || offer.status?.toLowerCase() === statusFilter;
    const departmentMatch = departmentFilter === 'all' || offer.department === departmentFilter;
    return statusMatch && departmentMatch;
  });

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <React.Fragment>
      <h1>Offers</h1>

      {/* Filters */}
      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="all">All Departments</option>
          {[...new Set(offers.map((o) => o.department))].map((dept, i) => (
            <option key={i} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Offers */}
      <div className="offers-list">
        {currentOffers.length > 0 ? (
          currentOffers.map((offer, index) => (
            <div key={index} className="offer-card">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <div className="items">
                <h6>Number of positions:</h6>
                <span>{offer.numberofplace}</span>
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

              {/* Status Badge */}
              <div className={`offer-status-badge ${offer.status?.toLowerCase()}`}>
                {offer.status}
              </div>

              {/* Action Buttons */}
              {offer.status === 'PENDING' && (
                <div className="offer-actions">
                  <button onClick={() => updateOfferStatus(offer.id, 'accepted')}>Accept</button>
                  <button onClick={() => updateOfferStatus(offer.id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No offers match your filters.</p>
        )}
      </div>

      {/* Pagination */}
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
