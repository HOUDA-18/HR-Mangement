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

export default function UpdateProfile({ onCancel, onSave }) {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    matricule: '',
  });

  // Charger les données depuis localStorage au montage du composant
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Mettre à jour les valeurs des champs
  const handleChange = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    // Récupérer l'objet utilisateur depuis localStorage
    const storedUser = localStorage.getItem("user");
  
    if (!storedUser) {
      console.error("Erreur : Aucun utilisateur trouvé dans localStorage !");
      return;
    }
  
    const user = JSON.parse(storedUser); // Convertir en objet JS
    const userId = user._id; // Extraire l'ID
  
    console.log("ID récupéré de localStorage :", userId);
  
    try {
      const response = await axios.put(
        `http://localhost:8090/api/users/update/${userId}`,
        userData
      );
  
      if (response.status === 200) {
        console.log("Profil mis à jour avec succès :", response.data);
        localStorage.setItem("user", JSON.stringify(response.data)); // Mettre à jour localStorage
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  };
  

  return (
    <MDBContainer className="py-5">
      <MDBRow>
        <MDBCol sm="3">
          <MDBCardText>First Name</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="text" name="firstName" value={userData.firstName} onChange={handleChange} />
        </MDBCol>
      </MDBRow>
      <hr />
      <MDBRow>
        <MDBCol sm="3">
          <MDBCardText>Last Name</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="text" name="lastName" value={userData.lastName} onChange={handleChange} />
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
          <MDBCardText>Matricule</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="text" name="matricule" value={userData.matricule} onChange={handleChange} />
        </MDBCol>
      </MDBRow>
      <hr />
      <MDBBtn type="button" color="primary" onClick={handleSave}>
        Save Changes
      </MDBBtn>
      <MDBBtn type="button" color="secondary" onClick={onCancel} className="ms-2">
        Cancel
      </MDBBtn>
    </MDBContainer>
  );
}
