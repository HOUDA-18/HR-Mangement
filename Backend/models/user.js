const roles = require('./rolesEnum')
const mongoose = require('mongoose')
const yup = require('yup')

const user = new mongoose.Schema({
    firstname: String,
    lastname: String,
    matricule: String,
    email: String,
    password: String,
    role: { type: String,
            enum: Object.values(roles)}

})

const User = mongoose.model('user', user)

const UserSchema = yup.object({
    body:
        yup.object({
            firstname: String,
            lastname: String,
            matricule: String,
            email: String,
            password: String,
        })
})

module.exports = {User, UserSchema}