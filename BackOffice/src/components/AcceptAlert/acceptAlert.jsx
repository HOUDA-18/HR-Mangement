import React, { useState } from 'react';
import './acceptAlert.scss';
import axios from 'axios';
import { employementTypes } from 'employementType';

const AcceptAlert = ({  onClose, applicationId, setOpenModalToast }) => {
    const [employmentDetails, setEmploymentDetails] = useState({
        employmentType: '',
        salary: '',

      });
      const [loading, setLoading]=useState(false)
      const [errors, setErrors] = useState({});
      const [error, setError]= useState("")

      const handleChange = (e) => {
        setEmploymentDetails({ ...employmentDetails, [e.target.name]: e.target.value });
      };
    
      const validate = () => {
        let tempErrors = {};
        if (!employmentDetails.employmentType) tempErrors.employmentType = "Employment type is required.";
        if (!employmentDetails.salary || isNaN(employmentDetails.salary) || employmentDetails.salary <= 0) 
          tempErrors.salary = "Salary must be a positive number.";
        setErrors(tempErrors);
        
        return Object.keys(tempErrors).length === 0;
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true)
            setError("")
          try {
            const response = await axios.post(`http://localhost:8070/api/candidatures/acceptCandidature/${applicationId}`, employmentDetails);
            console.log("response: ", response.data);
            setLoading(false)
            onClose();
            setOpenModalToast(true)
          } catch (err) {
            console.log("error: ", err);
            setLoading(false)
            setError(err.message)
          }
        }
      };
    
      return (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={onClose}>×</button>
            <h2>Employment Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employment Type:</label>
                <select
                  name="employmentType"
                  value={employmentDetails.employmentType}
                  onChange={handleChange}
                >
                  <option value="">Select Employment Type</option>
                  {employementTypes.map((type) => (
                    <option key={type.id} value={type.type}>{type.type}</option>
                  ))}
                </select>
                {errors.employmentType && <p className="error">{errors.employmentType}</p>}
              </div>
    
              <div className="form-group">
                <label>Salary (DT):</label>
                <input
                  type="number"
                  name="salary"
                  value={employmentDetails.salary}
                  onChange={handleChange}
                />
                {errors.salary && <p className="error">{errors.salary}</p>}
              </div>

              {error!='' && <div className="errorSubmit">{error}</div>}
              <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'loading...' : "Submit Candidate Acceptance"}</button>
            </form>
          </div>
        </div>
      );
};

export default AcceptAlert;
