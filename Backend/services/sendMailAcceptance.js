const {Offer} = require("../models/offre")
const {Candidature}= require("../models/candidature")
const nodemailer = require('nodemailer')
const {User}=require('../models/user')
const {Roles, candidatureStatus}= require('../models/Enums')

exports.sendAcceptanceMail= async(employeeFirstname, employeeLastname, employeeMail, employeeMatricule, employeePassword,employementType, hrEmail, offerTitle )=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
          user: process.env.MY_GMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });
  
      const candidateReceiver = {
          from: "webdesignwalah@gmail.com",
          to: employeeMail,
          subject: `📝 Job Application Acceptance`,
          html: `
          <html>
          <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Job Application Acceptance</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
        
            .email-container {
              background-color: #ffffff;
              max-width: 600px;
              margin: 40px auto;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        
            .email-header {
              background-color: #2ecc71;
              color: white;
              padding: 20px;
              text-align: center;
            }
        
            .email-body {
              padding: 30px;
            }
        
            .email-body h2 {
              color: #2c3e50;
            }
        
            .credentials {
              background-color: #ecf0f1;
              padding: 15px;
              margin-top: 20px;
              border-radius: 6px;
              font-family: monospace;
            }
        
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 0.85rem;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Congratulations!</h1>
            </div>
            <div class="email-body">
              <h2>Your Job Application Has Been Accepted</h2>
              <p>Dear ${employeeFirstname} ${employeeLastname},</p>
              <p>
                We are pleased to inform you that your application for the position at ${offerTitle} has been accepted.
                Welcome to the team!
              </p>
              <p>Please find below your employee credentials:</p>
              <div class="credentials">
                <p><strong>Matricule:</strong> <span id="matricule">${employeeMatricule}</span></p>
                <p><strong>Password:</strong> <span id="password">${employeePassword}</span></p>
              </div>
              <p>
                Please use these credentials to log in to the employee portal and complete your onboarding process.
              </p>
              <p>
                We look forward to working with you.
              </p>
              <p>Best regards,<br />
                HR Team<br />
                HRMS</p>
            </div>
            <div class="footer">
              © HRMS - All rights reserved
            </div>
          </div>
        </body>
        </html>
                `,
        };

      const hrReceiver = {
            from: "webdesignwalah@gmail.com",
            to: hrEmail,
            subject: `📝 Update on Offre ${offerTitle} Applicants`,
            html: `
            <html lang="en">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>New Employee Accepted</title>
                <style>
                    body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f7f9fa;
                    margin: 0;
                    padding: 0;
                    }

                    .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    overflow: hidden;
                    }

                    .header {
                    background-color: #3498db;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    }

                    .content {
                    padding: 30px;
                    }

                    .content h2 {
                    color: #2c3e50;
                    }

                    .employee-details {
                    background-color: #f1f1f1;
                    padding: 15px;
                    border-radius: 6px;
                    margin-top: 20px;
                    }

                    .footer {
                    padding: 20px;
                    text-align: center;
                    font-size: 0.85rem;
                    color: #888;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <div class="header">
                    <h1>New Employee Accepted</h1>
                    </div>
                    <div class="content">
                    <h2>HR Notification</h2>
                    <p>Dear HR Manager,</p>
                    <p>
                        We are pleased to inform you that a new employee has been officially accepted to join the organization.
                    </p>
                    <div class="employee-details">
                        <p><strong>Full Name:</strong> ${employeeFirstname} ${employeeLastname}</p>
                        <p><strong>Matricule:</strong> ${employeeMatricule}</p>
                        <p><strong>Employment Type:</strong> ${employementType}</p>
                        <p><strong>Salary:</strong> 2500 DT</p>
                    </div>
                    <p>
                        Please proceed with the necessary HR onboarding procedures and documentation.
                    </p>
                    <p>Thank you,<br/>Recruitment Team</p>
                    </div>
                    <div class="footer">
                    © HRMS – HR Department
                    </div>
                </div>
                </body>
                </html>`,
          };
  
      

 await transporter.sendMail(candidateReceiver);
 await transporter.sendMail(hrReceiver)
}