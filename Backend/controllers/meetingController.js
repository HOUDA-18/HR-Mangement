const {Candidature, candidatureSchema} = require("../models/candidature");
const nodemailer = require("nodemailer");
const {Roles, candidatureStatus}= require('../models/Enums')
const {Offer}=require('../models/offre');
const { User } = require("../models/user");
const {sendemailHr}= require('../services/sendMailHr');
const { default: axios } = require("axios");
const { sendInterviewMail } = require("../services/sendInterviewMail");
require('dotenv').config()
const token = process.env.TOKEN
async function createMeeting(topic, start_time,type,duration,timezone,agenda){
    try{
        const response = await axios.post('https://api.zoom.us/v2/users/me/meetings',{
            topic,
            type,
            start_time,
            duration,
            timezone,
            agenda,
            settings:{
                host_video:true,
                participant_video:true,
                join_before_host:false,
                mute_upon_entry:true,
                watermark:false,
                use_pmi:false,
                approval_type:0,
                audio:'both',
                auto_recording:'none'
            }
        },{
            headers:{
                'Authorization':`Bearer ${token}`
            },

        });
        const body = response.data;
        return body;
    }catch(error){
        console.error('Error',error);
    }
}


exports.createMeeting= async (req, res)=>{
    const {id}=req.params
    const {topic, start_time, duration, agenda}= req.body

    try{
        const candidature = await Candidature.findById(id).populate('idoffre');
        if(candidature){
            const adminHr= await User.findOne({role:Roles.ADMIN_HR})
            const response = await createMeeting(topic, start_time,"2", duration, 'Africa/Tunisia' ,agenda)
            
            console.log("response meeting: ", response);
            await sendInterviewMail(response, candidature, adminHr.email)
            await Candidature.findByIdAndUpdate(id, {status: candidatureStatus.INTERVIEW_SCHEDULED})
            res.status(200).json({"message": "interview created and mail sent succcessfully"})

        }
        else{
            res.status(400).json({"message": "inexistant candidature"});
        }


    }catch(error){
        res.json(error);
    }
}