const {Offer, offerSchema}= require('../models/offre');  // Assuming Offer model is already created
const {offreStatus, Roles}= require('../models/Enums')
const {User}= require('../models/user')
const {Departement}=require('../models/departement')
const {Team}=require('../models/team')
const nodemailer = require("nodemailer");

exports.addOffer = async (req, res) => {
    const { 
        title, 
        description, 
        skills, 
        numberofplace, 
        typeContrat, 
        niveaudetude, 
        anneeexperience, 
        departement,
        team
    } = req.body;

    // Check if offer with same title already exists
    if (await Offer.findOne({ title })) {
        return res.status(405).json("Offer with the same title already exists");
    }

    // Create a new Offer instance
    const newOffer = new Offer({
        title: title,
        description: description,
        status: offreStatus.PENDING,
        skills: skills || [],
        numberofplace: numberofplace,
        typeContrat: typeContrat,
        niveaudetude: niveaudetude,
        anneeexperience: anneeexperience,
        dateOffre: new Date(),
        departement: departement,
        team: team
    });

    try {
        // Save the new offer to the database
        await newOffer.save();
const checkUser = await User.findOne({ role: Roles.ADMIN_HR});
const departement = await Departement.findById(newOffer.departement)

const team = await Team.findById(newOffer.team)

    if (!checkUser) {
      return res
        .status(400)
        .send({ message: "User not found please register" });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const receiver = {
      from: "webdesignwalah@gmail.com",
      to: checkUser.email,
      subject: "New offre is waiting for approval",
      html: `
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              h2 {
                  color: #333;
              }
              p {
                  font-size: 16px;
                  color: #555;
              }
              .code {
                  font-size: 24px;
                  font-weight: bold;
                  background-color: #f8f8f8;
                  padding: 10px;
                  display: inline-block;
                  border-radius: 5px;
                  margin: 20px 0;
              }
              .btn {
                  display: inline-block;
                  background-color: #28a745;
                  color: white;
                  padding: 12px 20px;
                  text-decoration: none;
                  font-size: 16px;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .btn:hover {
                  background-color: #218838;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>New Offre was added</h2>
              <p>A new ${newOffer.typeContrat} offre is newly added for departement ${departement.name} and Team ${team.name}</p>
      
              </div>
</body>
</html>`,
    };

    await transporter.sendMail(receiver);

        // Respond with success message and offer details
        res.status(201).json({
            message: 'Offer successfully created!',
            offer: newOffer,
        });
    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({
            message: 'Error creating offer',
            error: error.message,
        });
    }
};

// Méthode pour obtenir toutes les offres
exports.getAllOffers = async (req, res) => {
    try {
      const offers = await Offer.find() // Vous pouvez peupler le champ "team" si nécessaire
      res.status(200).json(offers);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
