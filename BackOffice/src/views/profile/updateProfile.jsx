import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCardText,
  MDBBtn,
  MDBInput,
} from 'mdb-react-ui-kit';
import { useLocation, useNavigate } from 'react-router-dom';
import { isEqual } from "lodash";
import ConfirmationAlert from 'components/confirmationAlert/confirmationAlert';

export default function UpdateProfile() {
  const [initialUser, setInitialUser] = useState({})
  const [userData, setUserData] = useState({
    _id: '',
    firstname: '',
    lastname: '',
    email: '',
    matricule: '',
    phone: '',
  });
  const [loading, setLoading]=useState(false)
  const navigate = useNavigate();
  const [errors, setErrors] = useState('');
  const location = useLocation();

  // Charger les données depuis localStorage au montage du composant
  useEffect(() => {
    const storedUser = location.state?.values || JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setInitialUser(storedUser);
      setUserData(storedUser);
    }
  }, []);

  // Mettre à jour les valeurs des champs
  const handleChange = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onCancel = () => {
    if (isEqual(JSON.parse(localStorage.getItem('user')), initialUser)) {
      navigate('/app/dashboard/profile');
    } else {
      navigate('/app/dashboard/employees');
    }
  }

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert to Base64
      reader.onload = async () => {
        try {
            const base64Image = reader.result;
            setUserData((prev) => ({ ...prev, image: base64Image })); // Store URL
        } catch (error) {
          console.error("Image upload failed:", error);
        }
      };
    }
  };

  // Sauvegarder les modifications
  const handleSave = async (event) => {
    event.preventDefault();

    console.log("userData", JSON.stringify(userData))

    try {
      if (!isEqual(userData, initialUser)) {
        setErrors("");
        setLoading(true)
        const response = await axios.post(
          `http://localhost:8070/api/users/update/${userData._id}`,
          userData        );

          setLoading(false)
        if (response.status === 200) {
          setLoading(false)
          console.log("Profil mis à jour avec succès :", response.data);
          if (isEqual(JSON.parse(localStorage.getItem('user')), initialUser)) {
            localStorage.setItem("user", JSON.stringify(response.data.data)); // Mettre à jour localStorage

            navigate('/app/dashboard/profile');
          } else {
            navigate('/app/dashboard/employees');
          }
        }
      } else {
        setErrors("Nothing to change");
      }

    } catch (error) {
      setLoading(false)
      console.error("Erreur lors de la mise à jour du profil :", error);
      setErrors("Erreur lors de la mise à jour du profil ");
    }
  };

  return (
    <>
    <MDBContainer className="py-5">
      <MDBRow>
        <MDBCol sm="3">
          <MDBCardText>First Name</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="text" name="firstname" value={userData.firstname} onChange={handleChange} />
        </MDBCol>
      </MDBRow>
      <hr />
      <MDBRow>
        <MDBCol sm="3">
          <MDBCardText>Last Name</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="text" name="lastname" value={userData.lastname} onChange={handleChange} />
        </MDBCol>
      </MDBRow>
      <hr />
      <MDBRow>
        <MDBCol sm="3">
          <MDBCardText>Email</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="email" name="email" value={userData.email} onChange={handleChange} />
        </MDBCol>
      </MDBRow>
      <hr />
      <MDBRow>
        <MDBCol sm="3">
          <MDBCardText>Phone</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="text" name="phone" value={userData.phone} onChange={handleChange} />
        </MDBCol>
      </MDBRow>
      <hr />
      <MDBRow>
        <MDBCol sm="3">
          <MDBCardText>Matricule</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="text" name="matricule" value={userData.matricule} onChange={handleChange} />
        </MDBCol>
      </MDBRow>
      <hr />
      {initialUser._id === JSON.parse(localStorage.getItem("user"))._id &&<MDBRow>
        <MDBCol sm="3">
          <MDBCardText>Profile Picture</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <input type="file" name="image" onChange={handleImageChange} />
          <input 
                                    type="file" 
                                    id="fileInput" 
                                    style={{ display: 'none' }} 
                                    accept="image/jpeg" 
                                    onChange={handleImageChange} 
                                />
          {userData.image && (
            <img src={userData.image} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} />
          )}
        </MDBCol>
      </MDBRow>}
      <hr />
      <MDBBtn type="button" color="primary" onClick={handleSave}>
        Save Changes
      </MDBBtn>
      <MDBBtn type="button" color="secondary" onClick={onCancel} className="ms-2">
        Cancel
      </MDBBtn>
      {errors !== "" && <small className="text-danger form-text">{JSON.stringify(errors)}</small>}
    </MDBContainer>
                                  {loading && (
                                    <ConfirmationAlert
                                    message="loading..."
                                    />
                                )}</>
  );
}
