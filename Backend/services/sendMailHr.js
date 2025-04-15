const {Offer} = require("../models/offre")
const {Candidature}= require("../models/candidature")
const nodemailer = require('nodemailer')
const {User}=require('../models/user')
const {Roles, candidatureStatus}= require('../models/Enums')

const sendemailHr = async (offreId)=>{
    try {
        const offre = await Offer.findById(offreId)
        const candidatures= await Candidature.find({$and:[{idoffre: offreId}, {status: candidatureStatus.PENDING}]})
        if(candidatures.length%10==0){
            const adminHr = await User.findOne({role: Roles.ADMIN_HR})
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
                  to: adminHr.email,
                  subject: `📝 Update on Offre ${offre.title} Applicants`,
                  html: `
                  <html>
                    <head>
                        <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            padding: 20px;
                            color: #333;
                        }
                        .container {
                            background-color: #fff;
                            max-width: 600px;
                            margin: auto;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        }
                        h2 {
                            color: #0057a8;
                        }
                        .highlight {
                            font-weight: bold;
                            color: #0057a8;
                        }
                        .footer {
                            margin-top: 30px;
                            font-size: 12px;
                            color: #777;
                        }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                        <h2>📥 New Applications Alert</h2>
                        <p>Hello HR Team,</p>

                        <p>
                            The job offer titled <span class="highlight">${offre.title}</span> has now received 
                            <span class="highlight">${candidatures.length}</span> applications that aren't treated.
                        </p>

                        <p>
                            Please review the new submissions and take necessary action.
                        </p>

                        <p>Best regards,<br/>
                        Your Recruitment System</p>

                        <div class="footer">
                            This is an automated notification. Please do not reply to this email.
                        </div>
                        </div>
                    </body>
                    </html>`,
                };
          
              
        
        return await transporter.sendMail(receiver);
         }
       } catch (error) {
        return {error: error.message};
       }
} 

module.exports = { sendemailHr }