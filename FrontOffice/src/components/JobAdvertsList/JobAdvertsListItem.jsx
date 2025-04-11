import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApplyFormModal from "../applyModal/applyModal";
import './JobAdvertsListItem.scss'
export default function JobAdvertListItem({  offer , setShow, setSingleOffer}) {

  const handleShow = () => {setShow(true); setSingleOffer(offer)};
  if (offer.status !== "ACCEPTED") {
    return null;
  }



  return (
    <><div className="col-lg-4 col-md-6 mb-4" >
      <div className="job-card h-100">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="h5 mb-0">{offer.title}</h3>
            <span className="job-type">
              {offer.typeContrat}
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <div className="job-details">
            <div className="detail-item">
              <i className="bi bi-people"></i>
              <span className="detail-label">Open positions:</span>
              <span className="detail-value">
                {offer.numberofplace}
              </span>
            </div>
            
            <div className="detail-item">
              <i className="bi bi-mortarboard"></i>
              <span className="detail-label">Education:</span>
              <strong className="detail-value">{offer.niveaudetude}</strong>
            </div>

            <div className="detail-item">
              <i className="bi bi-clock-history"></i>
              <span className="detail-label">Experience:</span>
              <strong className="detail-value">
                {offer.anneeexperience} year(s)
              </strong>
            </div>
          </div>

          <div className="job-description">
            <p>{offer.description}</p>
          </div>

          <div className="skill-tags">
            {offer.skills?.map((skills, index) => (
              <span key={index} className="skill-tag">
                {skills}
              </span>
            ))}
          </div>
        </div>

        <div className="card-footer">
          <div className="d-flex justify-content-between align-items-center">
            <span className="post-date">
              <i className="bi bi-calendar"></i>
              {new Date(offer.dateOffre).toLocaleDateString()}
            </span>
            <button onClick={()=>handleShow()} className="apply-button">
              Apply Now <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>


      {/* CSS intégré amélioré */}

    </div>
          </>
  );
}