const {Offer} = require("../models/offre")
const {Candidature}= require("../models/candidature")
const nodemailer = require('nodemailer')
const {User}=require('../models/user')
const {Roles, candidatureStatus}= require('../models/Enums')

exports.sendInterviewMail= async(meet, candidature, hrEmail)=>{
    function extractDateAndTime(dateString) {
        const date = new Date(dateString);
      
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
      
        const formattedTime = date.toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
      
        return { date: formattedDate, time: formattedTime };
      }
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
          to: candidature.email,
          subject: `📝 Update on Offre ${candidature.idoffre.title} Applicants`,
          html: `
                <html lang="en" style="margin: 0; padding: 0;">
                <head>
                <meta charset="UTF-8">
                <title>Interview Invitation</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; margin: auto; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <tr>
                    <td align="center" style="padding-bottom: 20px;">
                        <h2 style="color: #333;">Interview Invitation</h2>
                    </td>
                    </tr>
                    <tr>
                    <td style="color: #555; font-size: 16px; line-height: 1.5;">
                        <p>Dear [Candidate Name],</p>
                        <p>We are pleased to inform you that you have been shortlisted for an interview with [Company Name].</p>
                        <p><strong>Meeting Details:</strong></p>
                        <ul>
                        <li><strong>Date:</strong> ${extractDateAndTime(meet.start_time).date}</li>
                        <li><strong>Time:</strong> ${extractDateAndTime(meet.start_time).time}</li>
                        <li><strong>Duration:</strong> Approximately ${meet.duration} minutes</li>
                        <li><strong>Mode:</strong> Online Meeting</li>
                        </ul>
                        <p><strong>Instructions:</strong></p>
                        <ol>
                        <li>Ensure a stable internet connection.</li>
                        <li>Find a quiet place for the interview.</li>
                        <li>Test your microphone and camera before the meeting.</li>
                        <li>Be ready 10 minutes before the scheduled time.</li>
                        </ol>
                        <p style="text-align: center; margin: 30px 0;">
                        <a href=${meet.join_url} target="_blank" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Join Meeting</a>
                        </p>
                        <p>If you have any questions, feel free to reply to this email.</p>
                        <p>Best regards,<br>Recruitement Team</p>
                    </td>
                    </tr>
                </table>
                </body>
                </html>
                `,
        };

      const hrReceiver = {
            from: "webdesignwalah@gmail.com",
            to: hrEmail,
            subject: `📝 Update on Offre ${candidature.idoffre.title} Applicants`,
            html: `
            <html lang="en" style="margin: 0; padding: 0;">
            <head>
              <meta charset="UTF-8">
              <title>Meeting Starting Notification</title>
            </head>
            <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f3f6; margin: 0; padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <h2 style="color: #333;">Meeting Reminder</h2>
                  </td>
                </tr>
                <tr>
                  <td style="color: #555; font-size: 16px; line-height: 1.6;">
                    <p>Hi,</p>
            
                    <p>This is a reminder that the interview meeting with <strong>${candidature.firstname+ " "+ candidature.lastname}</strong> is scheduled.</p>
            
                    <p><strong>Meeting Details:</strong></p>
                    <ul>
                      <li><strong>Candidate:</strong> ${candidature.firstname+ " "+ candidature.lastname}</li>
                      <li><strong>Position:</strong> ${candidature.idoffre.title}</li>
                      <li><strong>Date:</strong> ${extractDateAndTime(meet.start_time).date}</li>
                      <li><strong>Time:</strong> ${extractDateAndTime(meet.start_time).time} </li>
                    </ul>
            
                    <p style="margin-top: 20px;">Please ensure everything is ready and join the meeting at the scheduled time.</p>
            
                    <p style="text-align: center; margin: 30px 0;">
                      <a href=${meet.start_url} style="background-color: #28a745; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px;">Start the Meeting</a>
                    </p>
            
                    <p>If you encounter any issues, please contact the IT team or the recruitment coordinator immediately.</p>
            
                    <p>Best regards,<br>HR System Notification</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>`,
          };
  
      

 await transporter.sendMail(candidateReceiver);
 await transporter.sendMail(hrReceiver)
}