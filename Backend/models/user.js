const roles = require('./rolesEnum')
const mongoose = require('mongoose')
const yup = require('yup')

const user = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    matricule: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    active: Boolean,
    role: { type: String,
            enum: Object.values(roles)}

})

const User = mongoose.model('user', user)

const UserSchema = yup.object({
    body:
        yup.object({
            firstname: yup.string().min(3).max(20).required("firstname is required"),
            lastname: yup.string().min(3).max(20).required("lastname is required"),
            matricule: yup.string().min(3).max(20).required("matricule is required"),
            email: yup.string().email("Invalid email format").required("Email is required"),
            password: yup.string().required("password is required")
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