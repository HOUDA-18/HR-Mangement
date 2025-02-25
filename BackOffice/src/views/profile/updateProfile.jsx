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

export default function UpdateProfile() {
  const [initialUser, setInitialUser] = useState({})
  const [userData, setUserData] = useState({
    _id:'',
    firstname: '',
    lastname: '',
    email: '',
    matricule: '',
  });

  const navigate= useNavigate()

  const [errors, setErrors]=useState('')
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

  const onCancel = ()=>{
    navigate('/app/dashboard/profile', {state:{values: userData}})
  }

  // Sauvegarder les modifications
  const handleSave = async () => {
    event.preventDefault()
    
  
    try {
      
      if(!isEqual(userData, initialUser)){
        setErrors("")


        const response = await axios.put(
          `http://localhost:8070/api/users/update/${userData._id}`,
          userData
        );
    
        if (response.status === 200) {
          console.log("Profil mis à jour avec succès :", response.data);
          if(isEqual(JSON.parse(localStorage.getItem('user')), initialUser)){
            localStorage.setItem("user", JSON.stringify(response.data.data)); // Mettre à jour localStorage
            navigate('/app/dashboard/profile')
          }else{
            navigate('/app/dashboard/employees')
          }

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
