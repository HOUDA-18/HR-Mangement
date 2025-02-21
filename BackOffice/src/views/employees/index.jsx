import React, { useEffect, useState } from 'react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    fetch("http://localhost:5000/api/employees")
      .then((res) => {
        console.log("Réponse du serveur :", res);
        return res.json();
      })
      .then((data) => {
        console.log("Données reçues :", data);
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des employés :", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ 
      flex: 1,
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      margin: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{
        color: '#2c3e50',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: '600',
        textAlign: 'center'
      }}>
       List of employees
      </h1>
      {employees.length === 0 ? (
        <div style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '20px' }}>
          Aucun employé trouvé
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Nom</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Email</th>
              <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{emp.name}</td>
                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{emp.email}</td>
                <td style={{ padding: '12px 15px', textAlign: 'left' }}>{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Employees;
