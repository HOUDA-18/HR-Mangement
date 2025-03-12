import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Spinner } from 'react-bootstrap';

function Loginface() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasCamera, setHasCamera] = useState(true);

  // Vérifier l'accès à la caméra
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const imageSrc = webcamRef.current.getScreenshot();
      console.log('Image capturée:', imageSrc); // Pour débogage
      if (!imageSrc) throw new Error('Erreur de capture');

      const response = await fetch('http://localhost:8070/api/loginface', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: imageSrc })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Échec de la reconnaissance faciale');

      // Stockage des données utilisateur et redirection
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (!hasCamera) {
    return (
      <div className="text-center p-4">
        <Alert variant="danger">
          Autorisez l'accès à la caméra dans les paramètres de votre navigateur
        </Alert>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h2 className="mb-4" style={{ textAlign: 'center' }}>Login by Facial Recognition</h2>
      
      <div style={{
        position: 'relative',
        width: '640px',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user"
          }}
          style={{
            display: 'block',
            margin: '0 auto',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        />
      </div>
  
      <Button 
        variant="primary" 
        onClick={handleLogin}
        disabled={loading}
        size="lg"
        style={{
          marginTop: '20px',
          width: '200px'
        }}
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Authentification...
          </>
        ) : (
          'log in'
        )}
      </Button>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
}

export default Loginface;