const mongoose = require('mongoose');

const aiEvaluation = new mongoose.Schema({
    feedback: {type: String, required: true},
    rating: {type: String, required: true}
})
const transcript = new  mongoose.Schema( {
    role: {type: String, required: true}, 
    content:{type: String, required: true},
    timestamp: {type: Number, required: false}
  })
const skillEvaluation = new mongoose.Schema({
    skill: {type: String, required: true},
    ai_evaluation: {type: aiEvaluation, required: true},
    timestamp: {type: Number, required: false}
})
const aiInterview = new mongoose.Schema({
    interview_id: {type: String, required: true},
    interview_name: {type: String, required: true},
    candidate_name: {type: String, required: true},
    candidate_email: {type: String, required: true},
    report_date: {type: String, required: false},
    report_url: {type: String, required: false},
    interview_recording_url: {type: String, required: false},
    interview_transcript:{type: [transcript], required: true},
    technical_skills_evaluation:{type: [skillEvaluation], required: true},
    soft_skills_evaluation: {type: [skillEvaluation], required: true},
    date_created: {type: String, required: false},
    date_modified: {type: String, required: false},
    status: {type: String, default:"active"},
    proctoring_score: {type: Number, required: false, default:0},
    candidatureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidature' },
  });
   
  const AIinterview = mongoose.model('aiInterview', aiInterview);

  
  module.exports = { AIinterview };