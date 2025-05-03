const {Status, Roles, employmentType} = require('./Enums')
const mongoose = require('mongoose')
const yup = require('yup')

const aiEvaluation = new mongoose.Schema({
    feedback: {type: String, required: true},
    rating: {type: String, required: true}
})

const skillEvaluation = new mongoose.Schema({
    skill: {type: String, required: true},
    ai_evaluation: {type: aiEvaluation, required: true},
    timestamp: {type: Number, required: false}
})

const user = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    matricule: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    phone : {type: String},
    image : {type: String},
    faceDescriptor: { type: [Number], required: false },// Descripteur facial
    password: {type: String, required: true},
    employmentType: { type: String,
                      enum: Object.values(employmentType)},
    status: { type: String,
              enum: Object.values(Status)},
    role: { type: String,
            enum: Object.values(Roles)},
    createdAt: String,
    updatedAt: String,
    departement: { type: mongoose.Schema.Types.ObjectId, ref: 'departement', default: null },
    skills: {type: [String], required: false, default: null},
    soft_skills_evaluation: {type: [skillEvaluation], required: false, default: null},
    technical_skills_evaluation:{type: [skillEvaluation], required: false, default: null},
    salary: {type: Number, required: false, default: null},
    yearsOfExperience: {
        type: Number,
        min: 0,
        default: 0
      }
})

const User = mongoose.model('user', user)

const UserSchema = yup.object({
    body:
        yup.object({
            firstname: yup.string().min(3).max(20).required("firstname is required"),
            lastname: yup.string().min(3).max(20).required("lastname is required"),
            matricule: yup.string().min(3).max(20).required("matricule is required"),
            email: yup.string().email("Invalid email format").required("Email is required"),
            password: yup.string().required("password is required"),
            employmentType: yup.string().required("employement type is required"),
            
        })
})

const loginSchema = yup.object({
    body:
        yup.object({
            matricule: yup.string().min(3).max(20).required("matricule is required"),
            password: yup.string().required("password is required")
        })
})

module.exports = {User, UserSchema, loginSchema}
