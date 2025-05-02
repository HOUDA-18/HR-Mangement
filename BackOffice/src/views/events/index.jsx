import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';

const EventManager = () => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    attendance: 0
  });

  const [editMode, setEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: uuidv4(),
      ...formData,
      attendance: parseInt(formData.attendance)
    };

    if (editMode) {
      setEvents(events.map(event => 
        event.id === currentEventId ? newEvent : event
      ));
      setEditMode(false);
      setCurrentEventId(null);
    } else {
      setEvents([...events, newEvent]);
    }

    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      attendance: 0
    });
  };

  const [emailContent, setEmailContent] = useState('');
  const [showHtml, setShowHtml] = useState(false);

  // Mock AI email generator
  const generateEmailTemplate = () => {
    const eventDate = new Date(formData.date).toLocaleString();
    
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
          <h2 style="color: #2c3e50;">${formData.title || 'Event Name'}</h2>
        </div>
        
        <div style="padding: 20px;">
          <p style="color: #495057; font-size: 16px;">${formData.description || 'Event description goes here...'}</p>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #2c3e50; margin-bottom: 15px;">Event Details</h4>
            <p style="margin: 5px 0;">
              <strong>📅 Date:</strong> ${eventDate || 'Date not specified'}
            </p>
            <p style="margin: 5px 0;">
              <strong>📍 Location:</strong> ${formData.location || 'Location not specified'}
            </p>
            <p style="margin: 5px 0;">
              <strong>👥 Expected Attendance:</strong> ${formData.attendance || '0'}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="#" style="background: #007bff; color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px; display: inline-block;">
              RSVP Now
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; margin-top: 30px;">
          <p style="color: #6c757d; font-size: 14px;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    `;
  };

  const handleGenerateEmail = () => {
    const template = generateEmailTemplate();
    setEmailContent(template);
    setShowHtml(false);
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      attendance: event.attendance
    });
    setEditMode(true);
    setCurrentEventId(event.id);
  };

  const handleDelete = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const now = new Date();
  const pastEvents = events.filter(event => new Date(event.date) < now);
  const upcomingEvents = events.filter(event => new Date(event.date) >= now);
  const nextEvent = upcomingEvents[0];

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title as="h5">{editMode ? 'Edit Event' : 'Create New Event'}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Left Column - Form Fields */}
                <Col md={6}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Event Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        placeholder="Event Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Control
                        type="number"
                        name="attendance"
                        placeholder="Expected Attendance"
                        value={formData.attendance}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button variant="primary" type="submit">
                        {editMode ? 'Update Event' : 'Create Event'}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={handleGenerateEmail}
                      >
                        Generate Email Template
                      </Button>
                    </div>
                  </Form>
                </Col>

                {/* Right Column - Email Preview */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header>
                      <div className="d-flex justify-content-between align-items-center">
                        <Card.Title as="h5">Email Template Preview</Card.Title>
                        <div>
                          <Button 
                            variant={showHtml ? 'outline-secondary' : 'secondary'} 
                            size="sm"
                            onClick={() => setShowHtml(false)}
                          >
                            Preview
                          </Button>
                          <Button 
                            variant={showHtml ? 'secondary' : 'outline-secondary'} 
                            size="sm"
                            className="ms-2"
                            onClick={() => setShowHtml(true)}
                          >
                            HTML Code
                          </Button>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      {emailContent ? (
                        showHtml ? (
                          <pre style={{ whiteSpace: 'pre-wrap' }}>
                            {emailContent}
                          </pre>
                        ) : (
                          <div 
                            dangerouslySetInnerHTML={{ __html: emailContent }}
                            style={{
                              border: '1px solid #dee2e6',
                              borderRadius: '5px',
                              padding: '15px',
                              overflowY: 'auto',
                              maxHeight: '500px'
                            }}
                          />
                        )
                      ) : (
                        <div className="text-muted text-center py-5">
                          Click "Generate Email Template" to see a preview
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title as="h5">Next Event</Card.Title>
            </Card.Header>
            <Card.Body>
              {nextEvent ? (
                <div className="bg-light p-3">
                  <h3 className="text-primary">{nextEvent.title}</h3>
                  <Card.Text className="text-muted mb-3">
                    {nextEvent.description}
                  </Card.Text>
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Date</dt>
                    <dd className="col-sm-8">{new Date(nextEvent.date).toLocaleString()}</dd>
                    <dt className="col-sm-4">Location</dt>
                    <dd className="col-sm-8">{nextEvent.location}</dd>
                    <dt className="col-sm-4">Attendance</dt>
                    <dd className="col-sm-8">{nextEvent.attendance}</dd>
                  </dl>
                </div>
              ) : (
                <Card.Text className="text-muted">No upcoming events scheduled</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title as="h5">Upcoming Events</Card.Title>
            </Card.Header>
            <Card.Body>
              {upcomingEvents.map(event => (
                <Card key={event.id} className="mb-3">
                  <Card.Body>
                    <h5 className="text-primary">{event.title}</h5>
                    <Card.Text className="text-muted mb-2">{event.description}</Card.Text>
                    <dl className="row mb-2">
                      <dt className="col-sm-4">Date</dt>
                      <dd className="col-sm-8">{new Date(event.date).toLocaleString()}</dd>
                      <dt className="col-sm-4">Location</dt>
                      <dd className="col-sm-8">{event.location}</dd>
                      <dt className="col-sm-4">Attendance</dt>
                      <dd className="col-sm-8">{event.attendance}</dd>
                    </dl>
                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(event)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleDelete(event.id)}>
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              ))}
              {!upcomingEvents.length && <Card.Text className="text-muted">No upcoming events</Card.Text>}
            </Card.Body>
          </Card>
        </Col>

        <Col sm={12}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title as="h5">Past Events</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                {pastEvents.map(event => (
                  <Col md={4} key={event.id} className="mb-3">
                    <Card>
                      <Card.Body>
                        <h6 className="text-muted">{event.title}</h6>
                        <Card.Text className="text-muted small mb-2">
                          {new Date(event.date).toLocaleDateString()}
                        </Card.Text>
                        <Card.Text className="text-muted small mb-1">
                          {event.location}
                        </Card.Text>
                        <Card.Text className="text-muted small">
                          Attendance: {event.attendance}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {!pastEvents.length && <Card.Text className="text-muted">No past events</Card.Text>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default EventManager;