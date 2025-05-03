const {Status, Roles, employmentType} = require('./Enums')
const mongoose = require('mongoose')
const yup = require('yup')

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
    salary: Number,
    yearsOfExperience: Number,
    departement: { type: mongoose.Schema.Types.ObjectId, ref: 'departement', default: null },
    skills: {type: [String], required: false, default: null}

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
