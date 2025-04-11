import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const ApplyFormModal = ({ offre, setShow }) => {
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    cv: null,
  });

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    cv: '',
  });

  const handleClose = () => setShow(false);

  const removeFirstAndLastLine = (text) => {
    const lines = text.split('\n');
    if (lines.length <= 2) return ''; // If there are only 1 or 2 lines, return empty string
    return lines.slice(1, -2).join(' ').trim();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        axios
          .post('http://127.0.0.1:5000/analyze_resume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((res) => {
            const resa = JSON.parse(removeFirstAndLastLine(res.data));
            console.log("resa: ",resa)
            setTimeout(() => {
              setFormData({
                firstname: resa.firstName,
                lastname: resa.lastName,
                email: resa.email,
                phone: resa.phone,
                github: resa?.githubProfileUrl,
                linkedin: resa?.linkedinProfileUrl,
                cv: reader.result,                
                skills: resa.skills || [],
                languages: resa.languages || [],
                softwareDomains: resa.softwareDomains || null,
                technicalAssessment: resa.technicalAssessment || null,
                overallEvaluation: resa.overallEvaluation || null, 
                yearsOfExperience: parseInt(resa.yearsOfExperience),
                offre: offre._id
              });
              setIsLoading(false);
            }, 1000);
            setError("");
          })
          .catch((err) => {
            console.error('Error:', err);
            setIsLoading(false);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!formData.firstname) {
      errors.firstname = 'First name is required';
      valid = false;
    }
    if (!formData.lastname) {
      errors.lastname = 'Last name is required';
      valid = false;
    }
    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    }
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
      valid = false;
    }
    if (!formData.github) {
      errors.github = 'GitHub URL is required';
      valid = false;
    }
    if (!formData.linkedin) {
      errors.linkedin = 'LinkedIn URL is required';
      valid = false;
    }
    if (!formData.cv) {
      errors.cv = 'CV is required';
      valid = false;
    }
    if (recaptchaToken=="") {
      setError("Please complete the reCAPTCHA.");
      valid= false
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErreur("")
    if (validateForm()) {
      console.log(formData);
      setIsLoading(true)
      axios
          .post('http://localhost:8070/api/candidatures', formData)
          .then((res) => {
            setIsLoading(false);
            handleClose()
            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                github: '',
                linkedin: '',
                cv: null,
              })
          })
          .catch((err) => {
            console.error('Error:', err.statusCode);
            setErreur(err.message)
            setIsLoading(false);
          });
    }
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <Modal.Header className="d-flex justify-content-between align-items-start border-0 pb-0">
        <Modal.Title className="fw-bold fs-4">Apply for the Job</Modal.Title>
        <Button
          variant="outline-danger"
          onClick={handleClose}
          size="sm"
          className="ms-3"
          style={{ fontSize: '1.2rem', lineHeight: '1' }}
          aria-label="Close"
        >
          &times;
        </Button>
      </Modal.Header>
      <Modal.Body className="pt-3">
      {erreur=="Request failed with status code 405"  &&  <small className="text-danger form-text">You already applied for this offer</small>}
      {erreur=="Request failed with status code 400"  &&  <small className="text-danger form-text">Cannot Add Your candidature... please try later</small>}
        <Form onSubmit={handleSubmit}>
          {isLoading ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-primary">Loading your details...</p>
            </div>
          ) : (
            <>
             <Form.Group controlId="formCv" className="mb-4">
                <Form.Label>Upload CV</Form.Label>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <label htmlFor="cvUpload" className="btn btn-outline-primary">
                    <i className="bi bi-upload me-2"></i> Choose File
                  </label>
                  <input
                    type="file"
                    id="cvUpload"
                    style={{ display: 'none' }}
                    accept="application/pdf"
                    onChange={handleFileChange}
                    isInvalid={!!errors.cv}
                  />
                  <span className="text-muted small">
                    {formData.cv ? formData.cv.name : 'No file chosen'}
                  </span>
                </div>
                <Form.Control.Feedback type="invalid">{errors.cv}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  isInvalid={!!errors.firstname}
                />
                <Form.Control.Feedback type="invalid">{errors.firstname}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  isInvalid={!!errors.lastname}
                />
                <Form.Control.Feedback type="invalid">{errors.lastname}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGithub">
                <Form.Label>GitHub</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="Enter your GitHub URL"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  isInvalid={!!errors.github}
                />
                <Form.Control.Feedback type="invalid">{errors.github}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLinkedin">
                <Form.Label>LinkedIn</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your LinkedIn URL"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  isInvalid={!!errors.linkedin}
                />
                <Form.Control.Feedback type="invalid">{errors.linkedin}</Form.Control.Feedback>
              </Form.Group>

             
              <ReCAPTCHA
                  sitekey="6Lf7r-EqAAAAAO4wc5S9o3ZhF5ronTLKiptJZFKp"
                  onChange={(token) => {
                    setRecaptchaToken(token);
                    setError(""); // clear error if user completes captcha
                  }}
                />

                {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

              <div className="d-grid">
                <Button variant="primary" type="submit" className="py-2">
                  Submit Application
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ApplyFormModal;
