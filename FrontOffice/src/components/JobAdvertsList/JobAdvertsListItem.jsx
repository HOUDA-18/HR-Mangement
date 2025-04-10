import React from "react";
import { Link } from "react-router-dom";

export default function JobAdvertListItem({ offer }) {
  if (offer.status !== "ACCEPTED") {
    return null;
  }

  return (
    <div className="col-lg-4 col-md-6 mb-4">
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
            <Link 
              to="/" 
              className="apply-button"
            >
              Apply Now <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* CSS intégré amélioré */}
      <style jsx>{`
        .job-card {
          background: #ffffff;
          border-radius: 16px;
          border: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.03);
        }
        
        .job-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }
        
        .card-header {
          background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          color: white;
          padding: 1.5rem;
        }
        
        .card-header h3 {
          color: white;
          font-weight: 600;
          font-size: 1.25rem;
        }
        
        .job-type {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          color: white;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .card-body {
          padding: 1.75rem;
          background: #ffffff;
        }
        
        .job-details {
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.85rem;
          font-size: 0.95rem;
        }
        
        .detail-item i {
          margin-right: 0.75rem;
          color: #3a7bd5;
          font-size: 1.1rem;
          min-width: 20px;
          text-align: center;
        }
        
        .detail-label {
          color: #6c757d;
          margin-right: 0.5rem;
          font-weight: 500;
        }
        
        .detail-value {
          color: #2c3e50;
          font-weight: 600;
          margin-left: auto;
        }
        
        .job-description {
          margin-bottom: 1.75rem;
        }
        
        .job-description p {
          color: #495057;
          margin-bottom: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.6;
        }
        
        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .skill-tag {
          background: rgba(58, 123, 213, 0.1);
          color: #3a7bd5;
          padding: 0.35rem 0.9rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(58, 123, 213, 0.2);
        }
        
        .card-footer {
          padding: 1.25rem 1.75rem;
          background: #f9fbfd;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .post-date {
          color: #7f8c8d;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }
        
        .post-date i {
          font-size: 1rem;
        }
        
        .apply-button {
          background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          color: white;
          padding: 0.6rem 1.5rem;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(58, 123, 213, 0.2);
          border: none;
        }
        
        .apply-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(58, 123, 213, 0.3);
          background: linear-gradient(135deg, #2f6bc1 0%, #00c4f0 100%);
        }
        
        .apply-button i {
          transition: transform 0.3s ease;
        }
        
        .apply-button:hover i {
          transform: translateX(3px);
        }

        /* Animation subtile au chargement */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .job-card {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}