import React, { useState } from "react";
import axios from "axios";
import "./pdfUpload.scss"; // Import the SCSS file for styling

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({});
  const [error, setError] = useState("");
  const  removeFirstAndLastLine= (text) => {
    const lines = text.split('\n');
    if (lines.length <= 2) return ''; // S'il n'y a que 1 ou 2 lignes, on retourne une chaîne vide
    return lines.slice(1, -2).join(' ').trim();
  }
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://127.0.0.1:5000/analyze_resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("response: ",JSON.parse(removeFirstAndLastLine(response.data)))

      setResult(JSON.parse(removeFirstAndLastLine(response.data)));
    } catch (err) {
      console.log("err: ",err)
      setError("Failed to analyze the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-upload-container">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="file-input"
      />
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleUpload} disabled={loading} className="upload-button">
        {loading ? <div className="spinner"></div> : "Upload and Analyze PDF"}
      </button>
      {loading && <div className="loading-message">Analyzing...</div>}
      {result && (
        <div className="result-container">
          <h3>Analysis Result:</h3>
          <p>{JSON.stringify(result)}</p>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
