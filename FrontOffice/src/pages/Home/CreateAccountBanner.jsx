import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8070/api/offre/all')
      .then(response => {
        const acceptedOffers = response.data.filter(offer => offer.status === 'ACCEPTED');
        setOffers(acceptedOffers.slice(0, 3)); // Affiche seulement 3 offres
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching offers:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      paddingBottom: '3rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '5rem 1rem',
        marginBottom: '3rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa' // Couleur de fallback
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#212529'
        }}>
          Find Your Dream Job Today
        </h1>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          color: '#6c757d'
        }}>
          Browse our latest job opportunities
        </p>
      </div>

      {/* Featured Jobs */}
      <div style={{ padding: '2rem 0' }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '2rem',
          color: '#212529'
        }}>
          Featured Job Offers
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center' }}>Loading jobs...</div>
        ) : offers.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            padding: '0 1rem'
          }}>
            {offers.map(offer => (
              <div key={offer._id} style={{
                border: '1px solid #dee2e6',
                borderRadius: '0.25rem',
                transition: 'transform 0.3s, box-shadow 0.3s',
                backgroundColor: 'white',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: '0.75rem',
                    color: '#212529'
                  }}>
                    {offer.title}
                  </h3>
                  <p style={{
                    color: '#6c757d',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                  }}>
                    {offer.description.substring(0, 100)}...
                  </p>
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Type:</span> {offer.typeContrat}
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Positions:</span> {offer.numberofplace}
                  </div>
                  
                  <Link 
                    to={`/job-details/${offer._id}`}
                    style={{
                      display: 'inline-block',
                      padding: '0.375rem 0.75rem',
                      border: '1px solid #0d6efd',
                      borderRadius: '0.25rem',
                      color: '#0d6efd',
                      textDecoration: 'none',
                      transition: 'all 0.3s'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No featured jobs available</p>
          </div>
        )}
      </div>

      {/* Existing CreateAccountBanner */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '3rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#0d6efd',
          backgroundImage: 'linear-gradient(to right, #0d6efd, #0b5ed7)',
          borderRadius: '0.5rem',
          boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
          padding: '3rem',
          width: '75%',
          color: 'white'
        }}>
          <div style={{ flex: 2 }}>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Let's get connected and start finding your dream job
            </h1>
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link 
              to='/register' 
              style={{
                backgroundColor: 'white',
                color: '#0d6efd',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.25rem',
                textDecoration: 'none',
                fontWeight: 'bold',
                boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)'
              }}
            >
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;