const {Offer, offerSchema}= require('../models/offre');  // Assuming Offer model is already created
const {offreStatus, Roles}= require('../models/Enums')
const {User}= require('../models/user')
const {Departement}=require('../models/departement')
const {Team}=require('../models/team')
const nodemailer = require("nodemailer");
const { sendNotification } = require('../services/sendNotification');

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
        const departement = await Departement.findById(newOffer.departement)
        if(departement.name===""){
            newOffer.status=offreStatus.ACCEPTED
            await newOffer.save();
            res.status(201).json({
                message: 'Offer successfully created!',
                offer: newOffer,
            });
        }else{
        // Save the new offer to the database
           await newOffer.save();
            const checkUser = await User.findOne({ role: Roles.ADMIN_HR});


            const team = await Team.findById(newOffer.team)

                if (!checkUser) {
                return res
                    .status(400)
                    .send({ message: "User not found please register" });
                }

                const message = `An offer from department ${departement.name} titled ${newOffer.title} is waiting for your approval.`

                const notif = await sendNotification(checkUser._id, message, newOffer._id, departement.chefDepartement)

                    req.io.emit('receive_notification', notif);
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
                    subject: "📝 New Offer Awaiting Your Approval",
                    html: `
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>New HR Offer</title>
                        <style>
                            body {
                                font-family: 'Segoe UI', 'Roboto', sans-serif;
                                background-color: #f4f7fa;
                                margin: 0;
                                padding: 0;
                                color: #2c3e50;
                            }
                            .container {
                                max-width: 600px;
                                margin: 40px auto;
                                background: #ffffff;
                                padding: 30px 40px;
                                border-radius: 10px;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                                border-top: 6px solid #2f80ed;
                            }
                            h2 {
                                font-size: 24px;
                                color: #2f80ed;
                                margin-bottom: 16px;
                            }
                            p {
                                font-size: 16px;
                                line-height: 1.6;
                                margin-bottom: 20px;
                            }
                            .info-box {
                                background-color: #f0f4f8;
                                border-left: 4px solid #2f80ed;
                                padding: 15px;
                                margin: 20px 0;
                                border-radius: 6px;
                            }
                            .info-box strong {
                                display: block;
                                margin-bottom: 5px;
                                color: #333;
                            }
                            .btn {
                                display: inline-block;
                                background-color: #2f80ed;
                                color: white;
                                padding: 12px 20px;
                                font-size: 16px;
                                text-decoration: none;
                                border-radius: 6px;
                                font-weight: 500;
                                transition: background 0.3s ease;
                            }
                            .btn:hover {
                                background-color: #1c60b3;
                            }
                            .footer {
                                margin-top: 40px;
                                font-size: 13px;
                                color: #999;
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>New Offer Requires Your Review</h2>
                            <p>Hello,</p>
                            <p>A new offer has been submitted and requires your approval as part of the HR management process.</p>
                
                            <div class="info-box">
                                <strong>Offer Details:</strong>
                                <p><strong>Contract Type:</strong> ${newOffer.typeContrat}<br>
                                <strong>Department:</strong> ${departement.name}<br>
                                <strong>Team:</strong> ${team?.name}</p>
                            </div>
                
                            <a href="#" class="btn">Review Offer</a>
                
                            <div class="footer">
                                &copy; 2025 WebDesignWalah – HR Management System
                            </div>
                        </div>
                    </body>
                    </html>`,
                };

                await transporter.sendMail(receiver);
                res.status(201).json({
                    message: 'Offer successfully created!',
                    offer: newOffer,
                });
        }



        // Respond with success message and offer details

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
      .populate('departement', 'name') // Peupler seulement le nom du département
      .lean();

  // Transformer les données pour faciliter le filtrage
  const transformedOffers = offers.map(offer => ({
      ...offer,
      departementName: offer.departement?.name || null
  }));

  res.status(200).json(transformedOffers);
} catch (error) {
  console.error('Erreur lors de la récupération des offres:', error);
  res.status(500).json({ message: 'Erreur interne du serveur' });
}
};

exports.getOffers = async (req, res) => {
    try {
      const offers = await Offer.find({status: offreStatus.ACCEPTED}) // Vous pouvez peupler le champ "team" si nécessaire
      .populate('departement', 'name') // Peupler seulement le nom du département
      .lean();

  // Transformer les données pour faciliter le filtrage
  const transformedOffers = offers.map(offer => ({
      ...offer,
      departementName: offer.departement?.name || null
  }));

  res.status(200).json(transformedOffers);
} catch (error) {
  console.error('Erreur lors de la récupération des offres:', error);
  res.status(500).json({ message: 'Erreur interne du serveur' });
}
};

// Méthode pour mettre à jour le statut
exports.updateOfferStatus = async (req, res) => {
    try {
        const { status, comment } = req.body; // Ajout du commentaire
        const { id } = req.params;

        if (!Object.values(offreStatus).includes(status)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        const updateData = { status };
        if (status === 'REJECTED' && comment) {
            updateData.commentaire = comment;
        }

        const updatedOffer = await Offer.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate({
            path: 'departement',
            populate: {
                path: 'chefDepartement',
                model: 'user'
            }
        });

        if (!updatedOffer) {
            return res.status(404).json({ message: "Offre non trouvée" });
        }
        const adminHR= await User.findOne({role: Roles.ADMIN_HR})
        const message = `An offer from your department (${updatedOffer.departement.name}) was ${updatedOffer.status.toLowerCase()}.`

        const notif = await sendNotification(updatedOffer.departement?.chefDepartement?._id, message, updatedOffer._id, adminHR._id)

            req.io.emit('receive_notification', notif);

        // Envoi d'email
        if (updatedOffer.departement?.chefDepartement?.email) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MY_GMAIL,
                    pass: process.env.MY_PASSWORD
                }
            });

            let emailHtml = `<h2>Notification de changement de statut</h2>
                            <p>L'offre "${updatedOffer.title}" a été ${status === 'ACCEPTED' ? 'acceptée' : 'rejetée'}.</p>
                            <p><strong>Détails :</strong></p>
                            <ul>
                                <li>Titre: ${updatedOffer.title}</li>
                                <li>Département: ${updatedOffer.departement.name}</li>
                                <li>Type de contrat: ${updatedOffer.typeContrat}</li>
                                <li>Nouveau statut: ${status}</li>`;

            if (status === 'REJECTED' && updatedOffer.commentaire) {
                emailHtml += `<li>Commentaire: ${updatedOffer.commentaire}</li>`;
            }

            emailHtml += `</ul>`;

            await transporter.sendMail({
                from: process.env.MY_GMAIL,
                to: updatedOffer.departement.chefDepartement.email,
                subject: `Offre ${updatedOffer.title} ${status === 'ACCEPTED' ? 'Acceptée' : 'Rejetée'}`,
                html: emailHtml
            });
        }

        res.json(updatedOffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Nouvelle méthode pour mettre à jour le nombre de postes
exports.updateNumberOfPositions = async (req, res) => {
    try {
        const { delta } = req.body;
        const offer = await Offer.findOneAndUpdate(
            { 
                _id: req.params.id,
                numberofplace: { $gte: -delta } // Empêche les valeurs négatives
            },
            { $inc: { numberofplace: delta } },
            { new: true }
        );

        if (!offer) {
            return res.status(400).json({ 
                message: 'Update failed. Number of positions cannot be negative.' 
            });
        }

        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.hire= async (req, res)=>{
    const options = {
        method: 'POST',
        headers: {
          'x-api-key': '6313e8f64cddea8c9a6f6c9ff743f2a16b13a52eca5275f2f2e836a4157f4c1f428aeca0fe54aadba27f35bccda4af8ac9eba363bf94edb56a6041fc7926bc28',
          'Content-Type': 'application/json'
        },
        body: '{"interview_language":"en","can_change_interview_language":false,"only_coding_round":false,"is_coding_round_required":false,"selected_coding_language":"user_choice","is_proctoring_required":true,"skills":[{"name":"React"}],"interview_name":"Full Stack Engineer"}'
      };
      
      fetch('https://public.api.micro1.ai/interview', options)
        .then(response => res.send(response.json()))
        .then(response => console.log(response))
        .catch(err => res.send(err));
      
       
}

exports.closeOffre= async (req, res)=>{
    const {id}= req.params

    try {
        const offer = await Offer.findById(id).populate('departement')
        if (!offer){
            res.status(404).json({"message": "offer doesn't exist"})
        }else{
            const newOffer = await Offer.findByIdAndUpdate(id, {status: offreStatus.CLOSED}, {new: true})
            const adminHR= await User.findOne({role: Roles.ADMIN_HR})
            const message = `An offer from your department (${offer.departement.name}) was CLOSED.`

            const notif = await sendNotification(offer.departement?.chefDepartement, message, offer._id, adminHR._id)

                req.io.emit('receive_notification', notif);
            res.status(200).json(newOffer)
        }
    } catch (error) {
        res.status(400).json(error)
    }
}