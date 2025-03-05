const roles = require('./rolesEnum')
const mongoose = require('mongoose')
const yup = require('yup')

const user = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    matricule: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    phone : {type: String, required: true},
    image : {type: String, required: true},
    password: {type: String, required: true},
    active: Boolean,
    telephone: String,
    role: { type: String,
            enum: Object.values(roles)},
    departement: { type: mongoose.Schema.Types.ObjectId, ref: 'departement' }

})

const User = mongoose.model('user', user)

const UserSchema = yup.object({
    body:
        yup.object({
            firstname: yup.string().min(3).max(20).required("firstname is required"),
            lastname: yup.string().min(3).max(20).required("lastname is required"),
            matricule: yup.string().min(3).max(20).required("matricule is required"),
            email: yup.string().email("Invalid email format").required("Email is required"),
            phone: yup.string().required("phone is required"),
            image: yup.string().required("image is required"),
            password: yup.string().required("password is required"),
            telephone: yup.string()
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
