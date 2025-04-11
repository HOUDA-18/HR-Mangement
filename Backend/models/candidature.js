const mongoose = require('mongoose');
const yup = require('yup');
const {candidatureStatus}= require('./Enums')

const candidature = new mongoose.Schema({
    firstname: {
      type: String,
      required: [true, 'Firstname is required'],
    },
    lastname: {
      type: String,
      required: [true, 'Lastname is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    skills: {
      type: [String],
      required: [true, 'Skills are required'],
    },
    cv: {
        type: String,
        required: [true, 'CV is required'],
      
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    anneeexperience: {
      type: Number,
      min: 0,
      default: 0
    },
    idoffre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: [true, 'Offer ID is required'],
    },
    lien_linkdin: {
      type: String,
      default: '',
    },
    lien_git: {
      type: String,
      default: '',
    },
    dateApplication: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(candidatureStatus),
      default: candidatureStatus.PENDING,
    },
    softwareDomains: {
        type: [mongoose.Schema.Types.Mixed],
        default: null
    },
    technicalAssessment :{
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    overallEvaluation :{
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    languages:{
        type: [String],
        default: null 
    }
  });
  
  const Candidature = mongoose.model('Candidature', candidature);
  
  const candidatureSchema = yup.object({
    body: yup.object({
      firstname: yup.string().required("firstname is required"),
      lastname: yup.string().required("lastname is required"),
      email: yup.string().email("Invalid email").required("email is required"),
      phone: yup.string().required("phone is required"),
      skills: yup.array().of(yup.string()),
      languages: yup.array().of(yup.string()),
    }),
  });
  
  module.exports = { Candidature, candidatureSchema };