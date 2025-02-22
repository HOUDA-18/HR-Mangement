const roles = require('./rolesEnum')
const mongoose = require('mongoose')
const yup = require('yup')

const userSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    matricule: {type: String, unique: true, required: true},
    mail: {type: String, unique: true, required: true},
    mdp: {type: String, required: true},
    statut: {type: String, enum: ['active', 'inactive']},
    role: { type: String,
            enum: Object.values(roles)}

})

const User = mongoose.model('User', userSchema);

const UserSchema = yup.object({
    body:
        yup.object({
            firstname: yup.string().min(3).max(20).required("firstname is required"),
            lastname: yup.string().min(3).max(20).required("lastname is required"),
            matricule: yup.string().min(3).max(20).required("matricule is required"),
            mail: yup.string().email("Invalid email format").required("Email is required"),
            mdp: yup.string().required("password is required")
        })
})


module.exports = {User, UserSchema}
module.exports = mongoose.model('User', userSchema);
