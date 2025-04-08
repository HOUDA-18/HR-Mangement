const mongoose = require('mongoose')
const yup = require('yup')

const team = new mongoose.Schema({
    code: {type: String, required: true},
    name: {type: String, required: true},
    departement: { type: mongoose.Schema.Types.ObjectId, ref: 'departement' , default:null},
    headTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'user' , default:null},
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]

})

const Team = mongoose.model('team', team)

const TeamSchema = yup.object({
    body:
        yup.object({
            code: yup.string().min(3).max(20).required("Team code is required"),
            name: yup.string().min(2).max(50).required("Team name is required"),
            departement: yup.string().min(2).required("Departement is required")
        })
})


module.exports = {Team, TeamSchema}
