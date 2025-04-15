const mongoose = require('mongoose')
const yup = require('yup')

const departement = new mongoose.Schema({
    code: {type: String, required: true},
    name: {type: String, required: true},
    skills:{type : [String], required: false, default:[]},
    chefDepartement: { type: mongoose.Schema.Types.ObjectId, ref: 'user' , default:null},
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'team' }],
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]

})

const Departement = mongoose.model('departement', departement)

const DepartementSchema = yup.object({
    body:
        yup.object({
            code: yup.string().min(3).max(20).required("Departement code is required"),
            name: yup.string().min(2).max(50).required("Departement name is required")
        })
})


module.exports = {Departement, DepartementSchema}
