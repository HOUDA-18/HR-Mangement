import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button, Alert, Spinner,Form } from 'react-bootstrap';

function SignUpface() {
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    matricule: '',
    email: '',
    phone: '',
    password: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasCamera, setHasCamera] = useState(true);

  // Vérification de l'accès à la caméra
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérification des champs requis
    const requiredFields = ['firstname', 'lastname', 'matricule', 'email', 'phone', 'password'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0 || !image) {
      setError(`Champs manquants: ${missingFields.join(', ')}${!image ? ', Photo' : ''}`);
      return;
    }

    setLoading(true);

    try {
      // Conversion de l'image base64 en File
      const blob = await fetch(image).then(res => res.blob());
      const imageFile = new File([blob], 'face.jpg', { type: 'image/jpeg' });

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      form.append('imageData', imageFile);

      const response = await fetch('http://localhost:8070/api/signupface', {
        method: 'POST',
        body: form
      });

      if (!response.ok) throw new Error(await response.text());
      
      alert('Inscription réussie !');
      setFormData({
        firstname: '',
        lastname: '',
        matricule: '',
        email: '',
        phone: '',
        password: ''
        
      });
      setImage(null);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '30px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#2c3e50',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          Biometric Registration
        </h2>

        {/* Section Webcam */}
        <div style={{ 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '640px',
            maxWidth: '100%',
            margin: '0 auto 20px',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
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
                width: '100%',
                height: 'auto'
              }}
            />
          </div>
          
          <Button 
            variant={image ? 'outline-secondary' : 'primary'}
            onClick={captureImage}
            style={{
              padding: '12px 25px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            {image ? 'Recapture the photo' : 'Take the photo'}
          </Button>
        </div>

        {/* Formulaire */}
        <Form onSubmit={handleSubmit} style={{ marginTop: '25px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
          }}>
            {Object.keys(formData).map((field) => (
              <div key={field}>
                <Form.Label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#495057',
                  fontWeight: '500'
                }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: '1px solid #ced4da',
                    transition: 'border-color 0.3s ease'
                  }}
                  placeholder={`Entrez votre ${field}`}
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
              style={{
                padding: '15px 40px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '600',
                width: '100%',
                maxWidth: '400px'
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
                    style={{ marginRight: '10px' }}
                  />
                 Recording in progress...
                </>
              ) : (
                'Complete registration'
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="danger" style={{
              marginTop: '25px',
              borderRadius: '10px',
              textAlign: 'center',
              padding: '15px'
            }}>
              {error}
            </Alert>
          )}
        </Form>
      </div>
    </div>
  );
}

export default SignUpface;