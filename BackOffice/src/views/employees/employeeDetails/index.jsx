import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./index.scss"
import Chart from 'components/Chart/chart';
import SkillRadarChart from 'components/SpiderChartEmployee/spiderChartEmployee';
import axios from 'axios';


// ==============================|| DASHBOARD ANALYTICS ||============================== //

const employeeDetails = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const [employee, setEmployee]= useState({
    _id: "",
    firstname: "",
    lastname: "",
    matricule: "",
    email: "",
    phone: "",
    image: "",
    status: "",
    role: "",
    createdAt: "",
    departement: "",
    technical_skills_evaluation: []
    })
    const userId = location.state?.values
    const currentUser = JSON.parse(localStorage.getItem("user"))

    const handleEdit=()=>{
        navigate('/app/dashboard/updateProfile', {state:{ values: employee}})
    }
    useEffect(() => {

        axios.get(`http://localhost:8070/api/users/getById/${userId}`)
                .then((res)=>{
                    console.log("Données reçues :", res.data);
                    setEmployee(res.data)

                }).catch((err)=>{
                    console.error("Erreur lors de la récupération des employés :", err);

                })
      }, []);


  return (
    <React.Fragment>
                <div className="top">
                    <div className="left">
                    {(currentUser.role ==="ADMIN_HR" || currentUser.role==="MEMBRE_HR")&&<div className="editButton" onClick={()=>handleEdit(userId)}>Edit</div>}
                       <div className="item">
                        <img 
                           src={employee.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600"}
                           alt="" 
                           className="itemImg" 
                        />
                        <div className="details">
                            <h1 className="itemTitle">{employee.firstname + " "+ employee.lastname}</h1>
                            <div className="detailItem">
                                <span className="itemKey">Matricule: </span>
                                <span className="itemValue">{employee.matricule}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">Email: </span>
                                <span className="itemValue">{employee.email}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">Phone: </span>
                                <span className="itemValue">{employee.phone}</span>
                            </div>
                            {/*role matricule status telephone departement createdAt */}
                            {employee.titulaire && <div className="detailItem">
                                <span className="itemKey">Titulaire: </span>
                                <span className="itemValue">{employee.titulaire}</span>
                            </div>}
                            <div className="detailItem">
                                <span className="itemKey">Status: </span>
                                <span className={`itemValue ${employee.status}`}>{employee.status}</span>
                            </div>
                        </div>
                       </div>
                    </div>
                    <div className="right">
                        <Chart aspect={4} title={"Attendance overview"}/>
                        
                    </div>
                    
                </div>
                <div className="bottom">
                    <div className="column">
                        <SkillRadarChart data={employee.technical_skills_evaluation} />
                        {/* <List rows={rows} title={titre} catags={[]} type="livrables" /> */}
                    </div>
                    <div className="column">
                                                {/* Left column content (optional): list, soft skills, etc. */}

                    </div>
                </div>

    </React.Fragment>
  );
};

export default employeeDetails;