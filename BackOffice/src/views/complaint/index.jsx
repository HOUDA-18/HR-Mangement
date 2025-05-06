import { CheckCircle, Cancel, Info, Delete } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Card, Table, Form, Button } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Add, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Offcanvas, Toast } from 'bootstrap';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import quillEmoji from 'react-quill-emoji';
import 'react-quill-emoji/dist/quill-emoji.css';
import './index.scss';
import { includes } from 'lodash';
import badwords from './badWords.json';
const ComplaintsTable = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const [newComplaint, setNewComplaint] = useState({
    subject: '',
    category: '',
    description: '',
    priority: '',
    userId: currentUser._id
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Nombre d'éléments par page
  const [valueDescription, setValueDescription] = useState('');

  const [showComplaint, setShowComplaint] = useState('OWN');
  const isReadOnly = currentUser.role === 'SUPER_ADMIN' || showComplaint === 'OTHER';
  const isReadOnlyStatus = currentUser.role === 'EMPLOYEE' || (showComplaint === 'OWN' && currentUser.role !== 'SUPER_ADMIN');

  const [initialValues, setInitialValues] = useState({
    subject: '',
    category: '',
    description: '',
    priority: '',
    userId: '',
    status: ''
  });
  const [touchedDescription, setTouchedDescription] = useState(false);
  const stripHtml = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || '';
  };
  Quill.register(
    {
      'formats/emoji': quillEmoji.EmojiBlot,
      'modules/emoji-toolbar': quillEmoji.ToolbarEmoji,
      'modules/emoji-textarea': quillEmoji.TextAreaEmoji,
      'modules/emoji-shortname': quillEmoji.ShortNameEmoji
    },
    true
  );

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean']
  ];
  const handleCancel = () => {
    setShowAlert(false);
    setSelectedComplaint(null);
  };
  const handleOpenCanvas = () => {
    const offcanvasElement = document.getElementById('addComplaintOffcanvas');
    if (offcanvasElement) {
      const bsOffcanvas = new Offcanvas(offcanvasElement);
      bsOffcanvas.show();
    }
  };

  const handleConfirmComplaint = (complaintId) => {
    axios
      .put(`http://localhost:8070/api/complaints/confirm/${complaintId}`)
      .then(() => {
        setComplaints((prev) => prev.filter((c) => c._id !== complaintId));
        setShowAlert(false);
      })
      .catch((err) => console.error('Erreur:', err));
  };

  const handleRejectComplaint = (complaintId) => {
    axios
      .put(`http://localhost:8070/api/complaints/reject/${complaintId}`)
      .then(() => {
        setComplaints((prev) => prev.filter((c) => c._id !== complaintId));

        setShowAlertDelete(true);
      })
      .catch((err) => console.error('Erreur:', err));
  };

  const handleCloseCanvasAdd = () => {
    const offcanvasElement = document.getElementById('addComplaintOffcanvas');
    if (offcanvasElement) {
      const bsOffcanvas = Offcanvas.getInstance(offcanvasElement) || new Offcanvas(offcanvasElement);
      bsOffcanvas.hide();
    }
  };
  const handleCloseCanvasModify = () => {
    const offcanvasElement = document.getElementById('modifyComplaintOffcanvas');

    if (offcanvasElement) {
      const bsOffcanvas = Offcanvas.getInstance(offcanvasElement) || new Offcanvas(offcanvasElement);
      bsOffcanvas.hide();
    }
  };
  const handleDescriptionChange = (value) => {
    setValueDescription(value);
    setTouchedDescription(true);

    const plainText = value.replace(/<[^>]+>/g, '').toLowerCase();
    const containsBadWord = badwords.badWords.some((word) => plainText.includes(word.toLowerCase()));

    if (!/[a-zA-Z]/.test(plainText)) {
      if (touchedDescription) {
        setErrors((prev) => ({ ...prev, valueDescription: 'Description is required.' }));
      }
    } else if (containsBadWord) {
      setErrors((prev) => ({ ...prev, valueDescription: 'The description contains prohibited words.' }));
    } else {
      setErrors((prev) => ({ ...prev, valueDescription: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newComplaint.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!newComplaint.category) {
      newErrors.category = 'Category is required';
    }

    if (!valueDescription.trim()) {
      if (touchedDescription) {
        newErrors.valueDescription = 'Description is required';
      }
    }

    if (!newComplaint.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!newComplaint.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddComplaint = () => {
    if (validateForm()) {
      const complaintWithUser = {
        ...newComplaint,
        infoUser: currentUser,
        description: valueDescription
      };

      axios
        .post('http://localhost:8070/api/complaints/createComplaint', complaintWithUser)
        .then(() => {
          fetchComplaints();
          setNewComplaint({
            subject: '',
            category: '',
            description: '',
            priority: '',
            userId: currentUser._id
          });
          setValueDescription('');
          setErrors({});
          handleCloseCanvasAdd();
          setTitle('Succès');
          setMessage('Complaint added successfully.');
          const toastElement = document.getElementById('liveToast');
          const toast = new Toast(toastElement, {
            delay: 2000
          });
          toast.show();
        })
        .catch((err) => {
          console.error('Error adding complaint:', err);
          setTitle('Erreur');
          setMessage('Failed to add complaint. Please try again.');
          const toastElement = document.getElementById('liveToast');
          const toast = new Toast(toastElement, {
            delay: 2000
          });
          toast.show();
        });
    }
  };

  const fetchComplaints = async () => {
    const response = await axios.get(`http://localhost:8070/api/complaints/getAllComplaints`);
    if (showComplaint === 'OTHER') {
      if (currentUser.role === 'SUPER_ADMIN') {
        setComplaints(response.data);
      } else if (currentUser.role === 'ADMIN_HR') {
        setComplaints(response.data.filter((complaint) => complaint.userId.role !== 'ADMIN_HR'));
      } else if (currentUser.role === 'HEAD_DEPARTEMENT') {
        setComplaints(response.data.filter((complaint) => currentUser.departement.employees.includes(complaint.userId._id)));
        console.log(complaints);
      } else if (currentUser.role === 'EMPLOYEE') {
        setComplaints(response.data.filter((complaint) => complaint.userId._id === currentUser._id));
      }
    } else if (showComplaint === 'OWN') {
      if (currentUser.role === 'SUPER_ADMIN') {
        setComplaints(response.data);
      } else if (currentUser.role === 'ADMIN_HR') {
        setComplaints(response.data.filter((complaint) => complaint.userId._id === currentUser._id));
      } else if (currentUser.role === 'HEAD_DEPARTEMENT') {
        setComplaints(response.data.filter((complaint) => complaint.userId._id === currentUser._id));
      } else if (currentUser.role === 'EMPLOYEE') {
        setComplaints(response.data.filter((complaint) => complaint.userId._id === currentUser._id));
      }
    }
    setLoading(false);
  };
  const handleDeleteComplaint = (complaintId) => {
    axios.delete(`http://localhost:8070/api/complaints/deleteComplaint/${complaintId}`).then(() => {
      fetchComplaints();
      setTitle('Succès');
      setMessage('Complaint deleted successfully.');
      const toastElement = document.getElementById('liveToastDelete');
      const toast = new Toast(toastElement, {
        delay: 2000
      });
      toast.show();
    });
  };
  const handleDetailClick = (complaint) => {
    console.log(complaint);
    setSelectedComplaint(complaint);
    setInitialValues({
      subject: complaint.subject,
      category: complaint.category,
      description: complaint.description,
      valueDescription: complaint.description, // Assurez-vous que cette ligne est correcte
      priority: complaint.priority,
      userId: complaint.userId,
      status: complaint.status
    });

    const offcanvasElement = document.getElementById('modifyComplaintOffcanvas');
    if (offcanvasElement) {
      const bsOffcanvas = new Offcanvas(offcanvasElement);
      bsOffcanvas.show();
    }
  };
  const handleSubjectChange = (e) => {
    const value = e.target.value;
    const lowerValue = value.toLowerCase();
    const containsBadWord = badwords.badWords.some((word) => lowerValue.includes(word.toLowerCase()));

    setNewComplaint({ ...newComplaint, subject: value });

    if (containsBadWord) {
      setErrors({ ...errors, subject: 'The subject contains prohibited words.' });
    } else {
      setErrors({ ...errors, subject: '' });
    }
  };

  const handleModifyComplaint = () => {
    axios
      .put(`http://localhost:8070/api/complaints/updateComplaint/${selectedComplaint._id}`, initialValues)
      .then(() => {
        fetchComplaints();
        handleCloseCanvasModify();
        setTitle('Succès');
        setMessage('Complaint modified successfully.');
        const toastElement = document.getElementById('liveToast');
        const toast = new Toast(toastElement, {
          delay: 2000
        });
        toast.show();
      })
      .catch((err) => {
        console.error('Error modifying complaint:', err);
        setTitle('Erreur');
        setMessage('Failed to modify complaint. Please try again.');
        const toastElement = document.getElementById('filedToast');
        const toast = new Toast(toastElement, {
          delay: 2000
        });
        toast.show();
      });
  };
  useEffect(() => {
    fetchComplaints();
  }, [showComplaint]);

  // Calculer les éléments à afficher pour la page courante
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = complaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(complaints.length / itemsPerPage);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <div className="buttons">
        <h1>Complaints</h1>
        {currentUser.role !== 'SUPER_ADMIN' && (
          <div className="link" onClick={handleOpenCanvas}>
            <Add />
            Add Complaint
          </div>
        )}
      </div>

      <div
        style={{
          flex: 2,
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          margin: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h1
          style={{
            color: '#2c3e50',
            marginBottom: '20px',
            fontSize: '24px',
            fontWeight: '600',
            textAlign: 'center'
          }}
        >
          List of Complaints
        </h1>
        {currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'EMPLOYEE' && (
              <select
                className="form-select"
                style={{ marginBottom: '1rem', width: '30%' }}
                value={showComplaint}
                onChange={(e) => setShowComplaint(e.target.value)}
              >
                <option value="OWN">Own Complaints</option>
                <option value="OTHER">Other Complaints</option>
              </select>
            )}

        {complaints.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '20px' }}>No complaints found</div>
        ) : (
          <>
           
            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>
                    Subject
                  </th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>
                    Category
                  </th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>
                    Description
                  </th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>
                    Priority
                  </th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      Loading...
                    </td>
                  </tr>
                ) : (
                  currentItems.map((complaint, index) => (
                    <tr
                      key={complaint._id || index}
                      style={{ cursor: 'pointer', borderBottom: '1px solid #dddddd' }}
                      onClick={() => handleDetailClick(complaint)}
                    >
                      <td style={{ padding: '12px 15px', textAlign: 'left' }}>
                        <strong>{complaint.subject}</strong>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'left' }}>{complaint.category}</td>
                      <td style={{ padding: '12px 15px', textAlign: 'left' }}>
                        {complaint.description.length > 40
                          ? `${stripHtml(complaint.description).substring(0, 40)}...`
                          : stripHtml(complaint.description)}
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'left' }}>
                        <span
                          className="badge"
                          style={{
                            padding: '5px 10px',
                            borderRadius: '15px',
                            color: 'white',
                            fontWeight: 'bold',
                            backgroundColor:
                              complaint.status === 'pending'
                                ? '#ffc107'
                                : complaint.status === 'in_progress'
                                  ? '#17a2b8'
                                  : complaint.status === 'resolved'
                                    ? '#28a745'
                                    : '#dc3545'
                          }}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'left' }}>
                        <span
                          className="badge"
                          style={{
                            padding: '5px 10px',
                            borderRadius: '15px',
                            color: 'white',
                            fontWeight: 'bold',
                            backgroundColor:
                              complaint.priority === 'low'
                                ? '#28a745' // Vert (peu prioritaire)
                                : complaint.priority === 'medium'
                                  ? '#ffc107' // Jaune/orange (priorité moyenne)
                                  : complaint.priority === 'high'
                                    ? '#fd7e14' // Orange foncé (priorité élevée)
                                    : complaint.priority === 'urgent'
                                      ? '#dc3545' // Rouge (urgent)
                                      : '#6c757d' // Gris par défaut
                          }}
                        >
                          {complaint.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'left' }}>
                        {new Date(complaint.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className="cellAction " style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete complaint</Tooltip>}>
                            <div
                              className="deleteButton"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedComplaint(complaint);
                                setShowAlertDelete(true);
                              }}
                            >
                              <Delete />
                            </div>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-primary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft />
                </button>
                <span>Page:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={currentPage}
                  onChange={(e) => paginate(Number(e.target.value))}
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
                <span>of {totalPages}</span>
                <button className="btn btn-outline-primary" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showAlert && selectedComplaint && (
        <ConfirmationAlert
          show={!!showAlert}
          onCancel={handleCancel}
          onConfirm={() => {
            if (showAlert === 'confirm') handleConfirmComplaint(selectedComplaint._id);
            else if (showAlert === 'reject') handleRejectComplaint(selectedComplaint._id);
          }}
          message={
            showAlert === 'confirm'
              ? `Confirm the complaint from ${selectedComplaint.userId}?`
              : `Reject the complaint from ${selectedComplaint.userId}?`
          }
        />
      )}

      {showAlertDelete && selectedComplaint && (
        <ConfirmationAlert
          show={showAlertDelete}
          onCancel={() => {
            setShowAlertDelete(false);
            setSelectedComplaint(null);
          }}
          onConfirm={() => {
            handleDeleteComplaint(selectedComplaint._id);
            setShowAlertDelete(false);
            setSelectedComplaint(null);
          }}
          message={<strong>Are you sure you want to delete the complaint?</strong>}
        />
      )}

      {/* Add Complaint Offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabIndex="-1"
        id="addComplaintOffcanvas"
        aria-labelledby="addComplaintOffcanvasLabel"
        style={{ width: '550px' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="addComplaintOffcanvasLabel">
            Add New Complaint
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <form className="row g-3">
            <div className="col-md-12">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                type="text"
                className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                id="subject"
                value={newComplaint.subject}
                onChange={handleSubjectChange}
              />
              {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
            </div>
            <div className="col-md-12">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className={`form-select custom-select-bg ${errors.category ? 'is-invalid' : ''}`}
                id="category"
                value={newComplaint.category}
                onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="technical">Technical</option>
                <option value="service">Service</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="col-md-12">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                className={`form-select custom-select-bg ${errors.priority ? 'is-invalid' : ''}`}
                id="priority"
                value={newComplaint.priority}
                onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
            </div>
            <div className="col-md-12" style={{ background: 'white', height: '14rem', borderRadius: '8px' }}>
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <ReactQuill
                theme="snow"
                modules={{ toolbar: toolbarOptions }}
                value={valueDescription}
                onChange={handleDescriptionChange}
                style={{ height: '6rem', backgroundColor: 'white' }}
              />
              {errors.valueDescription && (
                <div className="invalid-feedback d-block" style={{ position: 'absolute', bottom: '60px' }}>
                  {errors.valueDescription}
                </div>
              )}
            </div>
            <div className="col-12 d-flex justify-content-center gap-2">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="offcanvas" aria-label="Close">
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddComplaint}>
                Add Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* modify Complaint Offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabIndex="-1"
        id="modifyComplaintOffcanvas"
        aria-labelledby="modifyComplaintOffcanvasLabel"
        style={{ width: '550px' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="modifyComplaintOffcanvasLabel">
            Modify Complaint
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <form className="row g-3">
            <div className="col-md-12">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="subject"
                value={initialValues.subject}
                onChange={(e) => setInitialValues({ ...initialValues, subject: e.target.value })}
                readOnly={isReadOnly}
              />
            </div>

            <div className="col-md-12">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className="form-select custom-select-bg"
                id="category"
                value={initialValues.category}
                onChange={(e) => setInitialValues({ ...initialValues, category: e.target.value })}
                disabled={isReadOnly}
              >
                <option value="">Select Category</option>
                <option value="technical">Technical</option>
                <option value="service">Service</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="col-md-12">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                className="form-select custom-select-bg"
                id="priority"
                value={initialValues.priority}
                onChange={(e) => setInitialValues({ ...initialValues, priority: e.target.value })}
                disabled={isReadOnly}
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="col-md-12">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select custom-select-bg"
                id="status"
                value={initialValues.status}
                onChange={(e) => setInitialValues({ ...initialValues, status: e.target.value })}
                disabled={isReadOnlyStatus}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {(currentUser.role === 'SUPER_ADMIN' ||
              (showComplaint === 'OTHER' && (currentUser.role === 'HEAD_DEPARTEMENT' || currentUser.role === 'ADMIN_HR'))) && (
              <div className="col-md-12">
                <label htmlFor="userId" className="form-label">
                  User
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userId"
                  value={initialValues.userId.lastname + ' ' + initialValues.userId.firstname}
                  readOnly
                />
              </div>
            )}

            <div className="col-md-12" style={{ background: 'white', height: '14rem', borderRadius: '8px' }}>
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <ReactQuill
                theme="snow"
                modules={{ toolbar: toolbarOptions }}
                value={initialValues.description}
                onChange={(value) => setInitialValues({ ...initialValues, description: value })}
                style={{ height: '6rem', backgroundColor: 'white' }}
                readOnly={isReadOnly}
              />
            </div>

            <div className="col-12 d-flex justify-content-center gap-2">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="offcanvas" aria-label="Close">
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleModifyComplaint}>
                Modify Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Toast */}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
        <div
          id="liveToast"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ backgroundColor: '#00bcd4', color: 'white' }}
        >
          <div className="toast-header">
            <strong className="me-auto">{title}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body" style={{ backgroundColor: '#00bcd4', color: 'white' }}>
            {message}
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
        <div
          id="filedToast"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ backgroundColor: 'rgb(247 44 44)', color: 'white' }}
        >
          <div className="toast-header">
            <strong className="me-auto">{title}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body" style={{ backgroundColor: 'rgb(247 44 44)', color: 'white' }}>
            {message}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ComplaintsTable;
