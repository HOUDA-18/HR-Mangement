const {Candidature, candidatureSchema} = require("../models/candidature");
const nodemailer = require("nodemailer");
const Roles = require("../models/rolesEnum");
const {candidatureStatus}= require('../models/Enums')


exports.addCandidature= async (req, res)=>{
    const {
        firstname,
        lastname,
        email,
        phone,
        skills,
        languages,
        softwareDomains,
        technicalAssessment,
        overallEvaluation,
        cv,
        offre,
        yearsOfExperience,
        github,
        linkedin, 
      }= req.body
      if(await Candidature.findOne({$and:[{idoffre:offre}, {email: email}]})){
        return res.status(405).json({message: "You already applied for this offer"})
    }
    else{
/*         const pdfData = `data:application/pdf;base64,${req.file.buffer.toString('base64')}`;
 */        const newCandidature = new Candidature({
              firstname:firstname,
              lastname: lastname,
              email:email,
              phone: phone,
              skills: skills,
              cv: cv,
              score: overallEvaluation?.overallScore,
              anneeexperience: yearsOfExperience || 0,
              idoffre: offre,
              lien_linkdin: linkedin,
              lien_git: github,
              dateApplication: new Date(),
              status: candidatureStatus.PENDING,
              languages: languages,
              softwareDomains: softwareDomains,
              technicalAssessment: technicalAssessment,
              overallEvaluation: overallEvaluation,
        })
        Candidature.create(newCandidature).then((candidature)=>{
            return res.status(201).json(candidature)
    
        }).catch((err)=>{
            return res.status(400).json({message: 'Cannot create candidature',
                                         error: err
                                        })
        })
    }
    
}