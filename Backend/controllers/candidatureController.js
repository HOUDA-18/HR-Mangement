const {Candidature, candidatureSchema} = require("../models/candidature");
const nodemailer = require("nodemailer");
const Roles = require("../models/rolesEnum");
const {candidatureStatus}= require('../models/Enums')
const {Offer}=require('../models/offre');
const { User } = require("../models/user");
const {sendemailHr}= require('../services/sendMailHr')

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
        Candidature.create(newCandidature).then( (candidature)=>{
            sendemailHr(candidature.idoffre).then((ress)=>{
              return res.status(201).json(candidature)

            }).catch((err)=>{
                console.log("err: ", err)
            })
    
        }).catch((err)=>{
            return res.status(400).json({message: 'Cannot create candidature',
                                         error: err
                                        })
        })
    }
    
}
exports.getStatusDistribution = async (req, res) => {
  try {
    const stats = await Candidature.aggregate([
      { $group: { 
        _id: "$status",
        count: { $sum: 1 }
      }}
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createCandidature = async (req, res) => {
  try {
    // Validation avec Yup
    await candidatureSchema.validate({ body: req.body });

    const newCandidature = new Candidature({
      ...req.body,
      idoffre: new mongoose.Types.ObjectId(req.body.idoffre)
    });

    const savedCandidature = await newCandidature.save();
    
    res.status(201).json(savedCandidature);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la création de la candidature', 
      error: error.message 
    });
  }
};

// Récupérer toutes les candidatures
exports.getAllCandidatures = async (req, res) => {
  try {
    const {  id } = req.params;
  
    const candidatures = await Candidature.find({idoffre: id}, 'firstname lastname email dateApplication status score anneeexperience');
    res.status(200).json(candidatures);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des candidatures', 
      error: error.message 
    });
  }
};

// Récupérer une candidature par ID
exports.getCandidatureById = async (req, res) => {
  try {
    const candidature = await Candidature.findById(req.params.id);
    
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    res.status(200).json(candidature);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la candidature', 
      error: error.message 
    });
  }
};

// Mettre à jour une candidature
exports.updateCandidature = async (req, res) => {
  try {
    const updatedCandidature = await Candidature.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('idoffre');
    
    if (!updatedCandidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    res.status(200).json(updatedCandidature);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la candidature', 
      error: error.message 
    });
  }
};

// Supprimer une candidature
exports.deleteCandidature = async (req, res) => {
  try {
    const deletedCandidature = await Candidature.findByIdAndDelete(req.params.id);
    
    if (!deletedCandidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    res.status(200).json({ message: 'Candidature supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la candidature', 
      error: error.message 
    });
  }
};

// Mettre à jour le statut d'une candidature
exports.updateCandidatureStatus = async (req, res) => {
  try {
    const { newStatus } = req.body;
    
    if (!Object.values(candidatureStatus).includes(newStatus)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    
    const updatedCandidature = await Candidature.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true }
    ).populate('idoffre');

    const offer = await Offer.findById(updatedCandidature.idoffre);
    const hrMail = await User.findOne({role: Roles.ADMIN_HR})
    
    if (!updatedCandidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
        const transporter = nodemailer.createTransport({
          service: "gmail",
          secure: true,
          auth: {
            user: process.env.MY_GMAIL,
            pass: process.env.MY_PASSWORD,
          },
        });
    
        const status = updatedCandidature.status; // "Accepted" ou "Rejected"

        const isAccepted = status.toLowerCase() === "accepted";
        const receiver = {
          from: "webdesignwalah@gmail.com",
          to: updatedCandidature.email,
          subject: "Update on Your Job Application",
          html: `
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Status</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                text-align: center;
              }
              h1 {
                color: ${isAccepted ? "#28a745" : "#dc3545"};
              }
              p {
                color: #555555;
                font-size: 16px;
                line-height: 1.6;
              }
              .btn {
        margin-top: 20px;
        padding: 12px 24px;
        background-color: ${isAccepted ? "#28a745" : "#dc3545"};
        color: white !important;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
        display: inline-block;
      }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #999999;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${isAccepted ? "🎉 Congratulations!" : "Thank You for Applying"}</h1>
              <p>
                Dear ${updatedCandidature.name || "Candidate"},
              </p>
              <p>
                Your application for the position <strong>${offer.title}</strong> has been 
                <strong>${status}</strong>.
              </p>
              ${
                isAccepted
                  ? `<p>We are thrilled to inform you that you have been selected for the next steps of our recruitment process. Our team will reach out to you shortly.</p>
                     <a href="mailto:${hrMail.email}" class="btn">Contact HR</a>`
                  : `<p>We regret to inform you that you have not been selected at this time. However, we truly appreciate your interest and encourage you to apply again in the future.</p>
                     <a href=${process.env.JOBS_URL} class="btn">View Other Opportunities</a>`
              }
              <div class="footer">
                &copy; ${new Date().getFullYear()} HR Management System. All rights reserved.
              </div>
            </div>
          </body>
          </html>`,
        };
        
    
        await transporter.sendMail(receiver);
    res.status(200).json(updatedCandidature);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du statut', 
      error: error.message 
    });
  }
};

// Statistiques des candidatures
exports.getCandidatureStats = async (req, res) => {
  try {
    const stats = await Candidature.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          scoreStats: [
            { 
              $group: { 
                _id: null,
                avgScore: { $avg: "$score" },
                maxScore: { $max: "$score" },
                minScore: { $min: "$score" }
              } 
            }
          ],
          experienceStats: [
            { 
              $group: { 
                _id: null,
                avgExperience: { $avg: "$anneeexperience" },
                maxExperience: { $max: "$anneeexperience" },
                minExperience: { $min: "$anneeexperience" }
              } 
            }
          ],
          topSkills: [
            { $unwind: "$skills" },
            { $group: { _id: "$skills", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ]);

    res.status(200).json({
      total: stats[0].total[0]?.count || 0,
      byStatus: stats[0].byStatus,
      scoreStats: stats[0].scoreStats[0] || {},
      experienceStats: stats[0].experienceStats[0] || {},
      topSkills: stats[0].topSkills
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques', 
      error: error.message 
    });
  }
};

// Récupérer les candidatures par offre
exports.getCandidaturesByOffer = async (req, res) => {
  try {
    const candidatures = await Candidature.find({ 
      idoffre: new mongoose.Types.ObjectId(req.params.offerId) 
    }).populate('idoffre');
    
    res.status(200).json(candidatures);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des candidatures', 
      error: error.message 
    });
  }
};

// Mettre à jour le score d'une candidature
exports.updateCandidatureScore = async (req, res) => {
  try {
    const { score } = req.body;
    
    if (score < 0 || score > 100) {
      return res.status(400).json({ message: 'Le score doit être entre 0 et 100' });
    }
    
    const updatedCandidature = await Candidature.findByIdAndUpdate(
      req.params.id,
      { score },
      { new: true }
    ).populate('idoffre');
    
    if (!updatedCandidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    res.status(200).json(updatedCandidature);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du score', 
      error: error.message 
    });
  }


  exports.updateCandidatureStatus = async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!['ACCEPTED', 'REJECTED', 'PENDING'].includes(status)) {
        return res.status(400).json({ message: "Statut invalide" });
      }
  
      const updatedCandidature = await Candidature.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
  
      if (!updatedCandidature) {
        return res.status(404).json({ message: "Candidature non trouvée" });
      }
  
      res.json(updatedCandidature);
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      res.status(500).json({ message: err.message });
    }
  };
};