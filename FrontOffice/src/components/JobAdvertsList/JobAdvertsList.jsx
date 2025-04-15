import "./JobAdvertsList.scss";

import React, { useEffect, useState } from "react";

import JobAdvertService from "../../services/jobAdvertService";
import JobAdvertsListItem from "./JobAdvertsListItem";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ApplyFormModal from "../applyModal/applyModal";
import Toast from "../toast/Toast";
import CustomToast from "../toast/Toast";

export default function JobAdvertsList({ size=10, pagination = true }) {
  const [jobAdverts, setJobAdverts] = useState(null);
  const [filteredAdverts, setFilteredAdverts] = useState([]);
  const [show, setShow] = useState(false);
  const [singleOffre, setSingleOffer] = useState({});
  const [erreur, setErreur]= useState("")
  const [type, setType]=useState("success")

  const [showToast, setShowToast]=useState(false)
  
  const [searchTitle, setSearchTitle] = useState("");
  const [typeContract, setTypeContract] = useState("");
  const [niveauEtude, setNiveauEtude] = useState("");

  // Pagination
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const jobsService = new JobAdvertService();
    jobsService.getAll()
      .then((res) => {
        setJobAdverts(res.data);
        setFilteredAdverts(res.data);
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }, []);

  useEffect(() => {
    if (jobAdverts) {
      const filtered = jobAdverts.filter((job) => {
        return (
          (typeContract === "" || job.typeContrat === typeContract) &&
          (niveauEtude === "" || job.niveaudetude === niveauEtude) &&
          job.title.toLowerCase().includes(searchTitle.toLowerCase())
        );
      });
      setFilteredAdverts(filtered);
      setCurrentPage(1); // Reset to first page on filter change
    }
  }, [searchTitle, typeContract, niveauEtude, jobAdverts]);

  // Paginated data
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredAdverts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredAdverts.length / itemsPerPage);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <>
      <div className="parent">
        <div className="p-4">
          <div className="text-center mb-3">
            <h1 className="text-secondary fw-bold">
              Featured Jobs<span className="text-primary">.</span>
            </h1>
            <p>Find your dream job.</p>

            {/* Filters */}
            <div className="filters d-flex flex-wrap justify-content-center gap-3 mt-4">
              <input
                type="text"
                placeholder="Search by title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="form-control w-auto"
              />

              <select
                value={typeContract}
                onChange={(e) => setTypeContract(e.target.value)}
                className="form-select w-auto"
              >
                <option value="">All Contracts</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
              </select>

              <select
                value={niveauEtude}
                onChange={(e) => setNiveauEtude(e.target.value)}
                className="form-select w-auto"
              >
                <option value="">All Education Levels</option>
                <option value="primary">primary</option>
                <option value="secondary">secondary</option>
                <option value="licence">licence</option>
                <option value="Engineering">Engineering</option>
                <option value="master">master</option>
                <option value="doctorat">doctorat</option>
                <option value="formation">formation</option>
              </select>
            </div>
          </div>

          {jobAdverts === null ? (
            <LoadingSpinner />
          ) : (
            <div>
              <div className="row justify-content-center">
                {currentItems.length > 0 ? (
                  currentItems.map((jobAdvert, index) => (
                    <JobAdvertsListItem
                      key={index}
                      offer={jobAdvert}
                      setShow={setShow}
                      setSingleOffer={setSingleOffer}
                    />
                  ))
                ) : (
                  <p className="text-center mt-4">No results found.</p>
                )}
              </div>

              {/* Pagination */}
              {pagination && totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4 gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo; Prev
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`btn ${
                        currentPage === idx + 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => handlePageChange(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {show && (
        <ApplyFormModal
          offre={singleOffre}
          setShow={setShow}
          setErreur={setErreur}
          setShowToast= {setShowToast}
          setType={setType}
        />
      )}

      {showToast && <CustomToast message={erreur} type={type} setShowToast={setShowToast}></CustomToast>}

    </>
  );
}
