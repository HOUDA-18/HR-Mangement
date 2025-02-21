import React, { useEffect, useState } from 'react';

const HRMembers = () => {
  const [hrMembers, setHRMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/rhmembers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Données RH reçues :", data);
        setHRMembers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des membres RH :", error);
        setLoading(false);
      });
  }, []);

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
                  }}>Nom</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '500',
                    fontSize: '16px'
                  }}>Email</th>
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
                    }}>{member.name}</td>
                    <td style={{
                      padding: '15px',
                      color: '#2c3e50',
                      fontSize: '14px'
                    }}>{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRMembers;
