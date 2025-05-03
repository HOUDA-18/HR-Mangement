import React, { useEffect, useState } from "react";
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowDown, FaBan, FaCheck, FaFileDownload, FaGithub, FaLinkedinIn, FaRobot } from "react-icons/fa";
import axios from "axios";
import { TbReportAnalytics } from "react-icons/tb";

import { HiVideoCamera } from "react-icons/hi2";
import InterviewAlert from "components/InterviewAlert/interviewAlert";
import AcceptAlert from "components/AcceptAlert/acceptAlert";


const JobApplicationDetails = () => {
  const [openModelInterview, setOpenModalInterview]= useState(false)
  const [openModelAccept, setOpenModalAccept]= useState(false)
  const [openModelToast, setOpenModalToast]= useState(false)

  const navigate = useNavigate()
    const location = useLocation();

    const applicationId = location.state?.values;

  const [application, setApplication]= useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    skills: [],
    cv: "",
    score: 0,
    lien_linkdin: "",
    lien_git:  "",
    dateApplication:  "",
    status:  "PENDING",
    softwareDomains:  [],
    technicalAssessment: "",
    overallEvaluation: "",
    languages: "",
  })

  useEffect(()=>{
        axios.get(`http://localhost:8070/api/candidatures/${applicationId}`)
        .then((res)=>{
            console.log("res get application: ",res.data)
            setApplication(res.data)
            console.log("offrein get: ", res.data.idoffre)

        }).catch((err)=>{
            console.log('err: ',err)
        })
  },[])

  const downloadCV = (cv) => {
    // Replace with actual URL if hosted somewhere
    const link = document.createElement("a");
    link.href = application.cv;
    link.download = `${application.firstname}_${application.lastname}_CV.pdf`;
    link.click();
  };

  const showAiInterviewReport = ()=>{
    navigate('/app/dashboard/candidatures/details/interviewDetails', {state:{values: applicationId}})
  }



  const handleOpenModalInterview=()=>{
    setOpenModalInterview(!openModelInterview)
    
  }

  const handleOpenModalAccept=()=>{
    setOpenModalAccept(!openModelAccept)
    
  }

  const generateAiInterview = ()=>{
    console.log("offre: ", application.idoffre)
    const formattedSkills = application.idoffre.skills.slice(0, 5).map(skill => ({ "name": skill }));
    console.log("formatted skills", formattedSkills)
     const options = {
      method: 'POST',
      headers: {
        'x-api-key': '8c75df16681105af6216dc15a98f973f5f94bf53b16d0c15d855b8193785ac89798dc6f8abd738d4447ed234ca606a96c1856a3f4f205e9466523b80dc826ede',
        'Content-Type': 'application/json',
      },
      body: `{"interview_language":"en","can_change_interview_language":false,"only_coding_round":false,"is_coding_round_required":false,"selected_coding_language":"user_choice","is_proctoring_required":true,"skills":${JSON.stringify(formattedSkills)},"interview_name":"${application.idoffre.title}"}`
    };
    fetch('https://public.api.micro1.ai/interview', options)
        .then(response =>{
          response.json().then((resss)=>{
            axios.post(`http://localhost:8070/api/candidatures/generateAIinterview/${applicationId}`, {'interviewLink': resss.data.invite_url})
                    .then((res)=>{
                        console.log("res after email: ",res.data)
                        window.location.reload()
                    }).catch((err)=>{
                        console.log('err: ',err)
                    })
          }).catch((errrror)=>{
              console.log("errrrrror: ",errrror )
          })
         /*   */
           
          
          })
        .then(response => console.log(response))
        .catch(err => console.log(err)); 
  }

  return (
    <>
    <div className="job-application-card">
      <div className="application-header">
          <h2>{application.firstname} {application.lastname}</h2>
          <div className="buttons">
            <button 
            className="accept" 
            disabled={!["INTERVIEW_PASSED","INTERVIEW_SCHEDULED"].includes(application.status)}
            onClick={handleOpenModalAccept}
            > 
            <FaCheck/>Accept
            </button>
            <button 
            className="reject" 
            disabled={!["INTERVIEW_PASSED","INTERVIEW_SCHEDULED"].includes(application.status)}
            onClick={()=>rejectCandidate(application)}
            >
              <FaBan/>Reject
            </button>
          </div>
      </div>
      
      <p className="status">Status: <span className={application?.status}>{application.status}</span></p>
      <p>📧 {application.email}</p>
      <p>📱 {application.phone}</p>
      <p>📅 Applied on: {new Date(application.dateApplication).toLocaleDateString()}</p>

      <div className="section">
        <h3>Skills</h3>
        {application.skills!=[] &&
        <ul className="skills">
          {application.skills.map(skill => <li key={skill}>{skill}</li>)}
        </ul>}
      </div>

      <div className="section">
        <h3>Languages</h3>
        {application.languages!=[] && <p>{application.languages.join(", ")}</p>}
      </div>

      <div className="section">
        <h3>Links</h3>
        <p><a href={application.lien_linkdin} target="_blank" rel="noopener noreferrer"><FaLinkedinIn/> LinkedIn</a></p>
        <p><a href={application.lien_git} target="_blank" rel="noopener noreferrer"><FaGithub/> GitHub</a></p>
      </div>

      <div className="section">
         <h3>Software Domains</h3>
        {application?.softwareDomains?.length>0 &&  application?.softwareDomains?.map(domain => (
          <p key={domain.domain}>{domain.domain} - {domain.score}%</p>
        ))}
      </div>

      <div className="section">
        <h3>Technical Assessment</h3>
        <ul>
          {Object?.entries(application?.technicalAssessment)?.map(([key, value]) => (
            <li key={key}><strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value}%</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>Overall Evaluation</h3>
        <p><strong>Score:</strong> {application.overallEvaluation.overallScore}%</p>
        <p><strong>Strengths:</strong> {application.overallEvaluation.strengths}</p>
        <p><strong>Weaknesses:</strong> {application.overallEvaluation.weaknesses}</p>
      </div>

      <div className="actions">
        <button className="left" onClick={application.status === "SHORTLISTED" ? generateAiInterview : showAiInterviewReport} disabled={!["SHORTLISTED", "AI_INTERVIEW_PASSED","INTERVIEW_PASSED","INTERVIEW_SCHEDULED"].includes(application.status) }>
        {application.status === "SHORTLISTED" ?<><FaRobot /> Schedule AI Interview</>  : <><TbReportAnalytics /> show interview report</>}
        </button>
        <button className="center" onClick={downloadCV}>
          <FaFileDownload /> Download CV
        </button>
        <button className="right" onClick={handleOpenModalInterview} disabled={application.status!=="AI_INTERVIEW_PASSED"}>
        <HiVideoCamera /> 
        {application.status === "INTERVIEW_SCHEDULED" ? "HR Interview Scheduled" : "AI_INTERVIEW_SCHEDULED" ? "Waiting AI Interview": "INTERVIEW_PASSED" ? "Interview passed": ""}

        </button>
      </div>

    </div>
         {openModelInterview && <InterviewAlert
                                    onClose={handleOpenModalInterview}
                                    applicationId = {applicationId}
                                  />}
          {openModelAccept && <AcceptAlert
                                onClose={()=>handleOpenModalAccept()}
                                applicationId = {applicationId}
                                setOpenModalToast={setOpenModalToast}
                              />}
          {openModelToast && <AcceptAlert
                                type={'success'}
                                message={"candidate accepted successfully"} 
                                setShowToast={setOpenModalToast}
                              />}

    </>
  );
};

export default JobApplicationDetails;
