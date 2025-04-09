// models/Offer.js
const mongoose = require('mongoose');
const {offreStatus}= require('./Enums')
const yup = require('yup')

const offer = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  status: { type: String,
    enum: Object.values(offreStatus)}
  ,
   skills: {
    type: [String],
    required: [true, 'Skills are required'],
  },
  numberofplace: {
    type: Number,
    required: [true, 'Number of positions is required'],
  },
  typeContrat: {
    type: String,
    required: [true, 'Contract type is required'],
    enum: ['CDI', 'CDD', 'Stage', 'Freelance'],
  },
  niveaudetude: {
    type: String,
    required: [true, 'Education level is required'],
    enum: [
      'primary',
      'secondary',
      'licence',
      'master',
      'Engineering',
      'doctorat',
      'formation',
    ],
  },
  anneeexperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0,
  },
  dateOffre: {
    type: Date,
    required: [true, 'Offer date is required'],
  },
  departement: { type: mongoose.Schema.Types.ObjectId, ref: 'departement' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'team' },
  commentaire: {type: String, default:""}
});

const Offer = mongoose.model('Offer', offer);
const offerSchema = yup.object({
    body:
        yup.object({
            title: yup.string().required("title is required"), 
            description: yup.string().required("description is required"), 
            numberofplace: yup.string().required("numberofplace is required"), 
            typeContrat: yup.string().required("typeContrat is required"), 
            niveaudetude: yup.string().required("niveaudetude is required"), 
            anneeexperience: yup.string().required("anneeexperience is required"), 
        })
})

module.exports = {Offer, offerSchema};
