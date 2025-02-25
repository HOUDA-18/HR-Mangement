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
import { useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    matricule: '',
  });

  const navigate= useNavigate()

  const [errors, setErrors]=useState('')

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

  const onCancel = ()=>{
    navigate('/app/dashboard/profile')
  }

  // Sauvegarder les modifications
  const handleSave = async () => {
    event.preventDefault()
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
      const compareUser={
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        matricule: user.matricule,
      }
      if(JSON.stringify(compareUser) !== JSON.stringify(userData)){
        const response = await axios.put(
          `http://localhost:8070/api/users/update/${userId}`,
          userData
        );
    
        if (response.status === 200) {
          console.log("Profil mis à jour avec succès :", response.data);
          localStorage.setItem("user", JSON.stringify(response.data)); // Mettre à jour localStorage
        }
      }else{
          setErrors("Nothing to change")
      }

    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      setErrors(error)
    }
  };
  

  return (
    <MDBContainer className="py-5">
      <MDBRow>
        <MDBCol sm="3">
          <MDBCardText>First Name</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="text" name="firstName" value={userData.firstname} onChange={handleChange} />
        </MDBCol>
      </MDBRow>
      <hr />
      <MDBRow>
        <MDBCol sm="3">
          <MDBCardText>Last Name</MDBCardText>
        </MDBCol>
        <MDBCol sm="9">
          <MDBInput type="text" name="lastName" value={userData.lastname} onChange={handleChange} />
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
      <MDBBtn type="button" color="primary" onClick={()=>handleSave()}>
        Save Changes
      </MDBBtn>
      <MDBBtn type="button" color="secondary" onClick={onCancel} className="ms-2">
        Cancel
      </MDBBtn>
      {errors!="" && <small className="text-danger form-text">{JSON.stringify(errors)}</small>}
    </MDBContainer>
  );
}
