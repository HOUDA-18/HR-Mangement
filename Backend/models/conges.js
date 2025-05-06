const mongoose = require('mongoose')
const yup = require('yup')

const conges = new mongoose.Schema({
    type: {type: String, enum: ['maternite', 'sans_solde', 'voyage'], default: 'voyage'},
    date_soumission: Date,
    startDate: Date,
    endDate: Date,
    reason: String,
    id_employee:String,
    status: {type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending'},
})

const Conges = mongoose.model('conges', conges)

const CongesSchema = yup.object({
    body:
        yup.object({
            type: yup.string().oneOf(['maternite', 'sans_solde', 'voyage']).default('voyage'),
            date_soumission: yup.date().required("Submission date is required"),
            startDate: yup.date().required("Start date is required"),
            endDate: yup.date().required("End date is required"),
            reason: yup.string().required("Reason is required"),
            id_employee: yup.string().required("Employee ID is required"),
            status: yup.string().oneOf(['pending', 'accepted', 'rejected']).default('pending')
        })
})


module.exports = {Conges, CongesSchema}
