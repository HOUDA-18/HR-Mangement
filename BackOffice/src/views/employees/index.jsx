import { Add, ArrowCircleUp, ArrowCircleUpRounded } from '@mui/icons-material';
import axios from 'axios';
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from "xlsx";

import "./index.scss"

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const Employees = () => {

  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  
  const validateUsers = (data) => {
    return data.map((user, index) => {
      if (!user.Firstname || !user.Lastname || !user.Email || !user.Matricule || !user.Password) {
        throw new Error(`Row ${index + 1} is missing required fields.`);
      }
      return {
        firstname: user.Firstname.trim(),
        lastname: user.Lastname.trim(),
        password: user.Password.trim(),
        email: user.Email.trim(),
        matricule: user.Matricule.trim(),
      };
    });
  };

  const handleCancel = ()=>{
    setShowAlert(false)

  }

  const handleConfirm = async() => {
    try {
      console.log(uploadedUsers)
      const respone = await axios.post("http://localhost:8070/api/users/import", validatedData);
      setShowAlert(false);
      alert(JSON.stringify(respone));
      setValidatedData([]);
      console.log('Confirmed');
    } catch (error) {
      console.log(error)
    }
    
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON


      setValidatedData( validateUsers(parsedData));
      console.log("validatedUsers", validateUsers(parsedData))
      setShowAlert(true);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };


  return (
    <React.Fragment>
      <div className="buttons">
        <h1>Employees</h1>
          <Link to="add" className="link">
                  <Add/>
                    Add employee
          </Link>
          <div className="excel-Button">
                <div className="file-upload">
                  <ArrowCircleUp className="upload-icon" />
                  <span>Upload users from excel file</span>
                  <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                </div>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          </div>

      </div>
        
        

      {uploadedUsers.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(uploadedUsers[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uploadedUsers.map((user, index) => (
              <tr key={index}>
                {Object.values(user).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

                      {showAlert && (
                                    <ConfirmationAlert
                                    message="Are you sure to add this list of users?"
                                    onConfirm={()=>handleConfirm()}
                                    onCancel={handleCancel}
                                    />
                                )}

    </React.Fragment>
  );
};

export default Employees;