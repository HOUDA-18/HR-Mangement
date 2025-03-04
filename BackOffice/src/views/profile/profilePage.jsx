import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBProgress,
  MDBProgressBar,
} from 'mdb-react-ui-kit';
export default function ProfilePage( ){
  const navigate = useNavigate()
  const location = useLocation();

  const user = location.state?.values || JSON.parse(localStorage.getItem("user")) || {
    firstName: "Utilisateur",
    lastName: "Inconnu",
    matricule: "N/A",
    email: "inconnu@example.com",
    phone: "N/A",
    image : "https://mdbootstrap.com/img/new/avatars/2.jpg",
  };


  const handleUpdate = ()=>{
      navigate('/app/dashboard/updateProfile',{state:{ values: user}})
  }

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
              <MDBCardImage
  src="https://scontent.ftun16-1.fna.fbcdn.net/v/t39.30808-6/417481696_1788065228370873_7033853198704674306_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=qwlSvO3MlmcQ7kNvgFnln4x&_nc_oc=AdgCJlBnX3oq5k7BNMHaKDsPuPUUIInCT5vs36JOKiPJIKxP5rmiUFXPHgueqscDbvI&_nc_zt=23&_nc_ht=scontent.ftun16-1.fna&_nc_gid=AgQ6xsgKNoSMGdw_ZZL6V_z&oh=00_AYCI_CUVISPCyCtKpf-qdG7XWmLsTNnYmEuLiQfesiH49w&oe=67CC0939"  // Your image URL here
  alt="avatar"
  className="rounded-circle"
  style={{ width: '150px' }}
  fluid
/>

                <p className="text-muted mb-1">Full Stack Developer</p>
                <p className="text-muted mb-4">La petite ariana, TUNIS</p>
                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn>Follow</MDBBtn>
                  <MDBBtn outline className="ms-1">
                    Message
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fas icon="globe fa-lg text-warning" />
                    <MDBCardText>https://HrMangment.com</MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="github fa-lg" style={{ color: '#333333' }} />
                    <MDBCardText>NourheneOuhichi2002</MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="twitter fa-lg" style={{ color: '#55acee' }} />
                    <MDBCardText>@nourheneouhichi</MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="instagram fa-lg" style={{ color: '#ac2bac' }} />
                    <MDBCardText>nourheneouhichi</MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="facebook fa-lg" style={{ color: '#3b5998' }} />
                    <MDBCardText>nourheneouhichi</MDBCardText>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                <MDBCol sm="3"><MDBCardText>FirstName</MDBCardText></MDBCol>
                <MDBCol sm="9"><MDBCardText className="text-muted"> {user.firstname}</MDBCardText></MDBCol>
                 
                </MDBRow>
                <hr />

                <MDBRow>
                <MDBCol sm="3"><MDBCardText>LastName</MDBCardText></MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted"> {user.lastname}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{user.email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{user.phone}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Matricule</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{user.matricule}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn onClick={handleUpdate}> Update</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">
                      <span className="text-primary font-italic me-1">assignment</span> Project Status
                    </MDBCardText>
                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={66} valuemin={0} valuemax={100} />
                    </MDBProgress>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}