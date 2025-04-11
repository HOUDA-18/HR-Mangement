const mongoose = require('mongoose');
const yup = require('yup');

const candidatureStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};
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
    type: String, // URL or file path
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
    required: [true, 'Years of experience is required'],
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
});

const Candidature = mongoose.model('Candidature', candidature);

const candidatureSchema = yup.object({
  body: yup.object({
    firstname: yup.string().required("firstname is required"),
    lastname: yup.string().required("lastname is required"),
    email: yup.string().email("Invalid email").required("email is required"),
    phone: yup.string().required("phone is required"),
    skills: yup.array().of(yup.string()).required("skills are required"),
    score: yup.number().min(0).max(100),
  }),
});

// À la fin de candidatureModel.js
module.exports = {
  Candidature,
  candidatureSchema,
  candidatureStatus
};