from flask import Flask, request, jsonify
import io
import os
import PyPDF2
import google.generativeai as genai
from flask_cors import CORS

genai.configure(api_key="AIzaSyCwSAlDnU2B_itJgJyHSfvCtjgIJtsjKqg")
Model = genai.GenerativeModel("gemini-2.0-flash-lite")

app = Flask(__name__)
CORS(app)

def extract_text_from_pdf(file_content):
    reader = PyPDF2.PdfReader(io.BytesIO(file_content))
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def analyzecv_pdf_withllm(text):
    prompt = f"""
You are a software engineering recruitment specialist. Analyze the CV provided below to assess the candidate's technical skills and experience.  
And return me only json object
💡 **Important Notes:**  
- **Determine the language of the CV** and provide the analysis in **the same language**.  
- If the CV is entirely in **English**, respond in **English**. If it's in **Turkish**, respond in **Turkish**.  
- If the CV contains mixed languages, select the **most dominant language** and respond accordingly.  
- If some sections are missing, **analyze based on the available information**.  
---
### **1. Candidate Details Extraction**
Extract and return the following information from the CV if available in json format:

  "firstName": "",
  "lastName": "",
  "email": "",
  "phone":"",
  "githubProfileUrl": "https://XXXXXX",
  "linkedinProfileUrl": "https://XXXXX",
  "yearsOfExperience": "",
  "skills": [],
  "languages": [],
  "softwareDomains": 
    "domain": "Domain 1", "score": 0,
    "domain": "Domain 2", "score": 0,
    "domain": "Domain 3", "score": 0
  ,
  "technicalAssessment": 
    "technicalSkills": 0,
    "experienceAndProjects": 0,
    "educationAndCertifications": 0,
    "problemSolvingAbility": 0,
    "communicationAndTeamwork": 0,
    "openSourceAndSideProjects": 0
  ,
  "overallEvaluation": 
    "overallScore": 0,
    "strengths": "",
    "weaknesses": ""
  


---

### **2️. Software Domain Analysis**  
- Identify the **top 3 most suitable software domains** for the candidate.  
- Consider the **Summary, Cover Letter, Experience, Projects, and Education** sections when evaluating.  
- Assign scores **out of a total of 100 points** across the three domains.  

---

### **3️. Technical and General Assessment**  
Evaluate the candidate's competencies based on the following criteria and **assign a score between 0 and 100**:  
- **Technical Skills:** Programming languages, frameworks, databases, cloud technologies  
- **Experience & Projects:** Work history, project roles, responsibilities  
- **Education & Certifications:** Degrees, bootcamps, certifications, academic achievements  
- **Problem-Solving Ability:** Algorithms, data structures, optimization skills  
- **Communication & Teamwork:** Technical documentation, collaboration, mentoring experience  
- **Open Source Contributions & Side Projects:** GitHub activity, contributions, independent projects  

---

### **4️. Overall Evaluation**  
Assess the candidate's **overall performance out of 100 points** and summarize their strengths and weaknesses.  

📌 **Example Output:**  
- **Overall Score:** XX/100  
- **Strengths:** Strong technical skills, extensive experience, etc.  
- **Weaknesses:** Lack of open-source contributions, weak problem-solving skills, etc.  

---

📌 **Language Detection:**  
First, **detect the language of the CV**. If the CV is in **English**, provide the response in **English**. If the CV is in **French**, provide the response in **French**. If it's in **Turkish**, respond in **Turkish**.  

**CV Content:**  
{text}
"""

    
    response = Model.generate_content(prompt)
    return response.text

@app.route('/analyze_resume', methods=['POST'])
def analyze_resume():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    text = extract_text_from_pdf(file.read())
    result = analyzecv_pdf_withllm(text)
    print(result)
    return  result

if __name__ == "__main__":
    app.run(port=4000, debug=True)
