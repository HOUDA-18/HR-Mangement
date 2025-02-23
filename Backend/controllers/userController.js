const {User, UserSchema} = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const roles = require('../models/rolesEnum')
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Joi = require("joi");
require("dotenv").config();

exports.login= async (req,res)=>{
    const {matricule, password} = req.body
    const user = await User.findOne({matricule:matricule})
    if (user == null) {
        return res.status(400).json('Cannot find user')
    }
    try {
        const id = user.id;
        bcrypt.compare(password, user.password, async (err, ress)=>{
        const token= jwt.sign({id}, process.env.JWT_SECRET)
         if(ress ) {
            if(user.active==false){
                    await User.findOneAndUpdate({matricule: matricule}, {active: true})
            }
            res.status(200).json({user: user,
                  token: token
                })
            }
            else{
                res.status(405).json({message: "Verify credentials"}) 
            }
        }) 
            
       
    } catch (err){
        res.status(500).json({error: err})
    }
}

exports.register= async (req,res)=>{

    const { firstname, lastname, matricule, email, password} = req.body
    const u = new User({
        firstname: firstname,
        lastname: lastname,
        matricule: matricule,
        email: email,
        password: (await bcrypt.hash(password, 10)).toString(),
        active: false,
        role: roles.EMPLOYEE
    })

    if(await User.findOne({matricule: matricule})){
        return res.status(405).json("matricule already exists")
    }
    if(await User.findOne({email: email})){
        return res.status(405).json("email already exists")
    }
    else{
        User.create(u).then((user)=>{
            return res.status(201).json( user)
    
        }).catch((err)=>{
            return res.status(400).json('Cannot create user')
        })
    }

}






    exports.forgetPassword = async (req, res) => {

        try {
            const { email } = req.body;
        
            if (!email) {
              return res.status(400).send({ message: "Please provide email" });
            }
        
            const checkUser = await User.findOne({ email });
        
            if (!checkUser) {
              return res
                .status(400)
                .send({ message: "User not found please register" });
            }
        
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });
        
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
              to: email,
              subject: "Password Reset Request",
              text: `Click on this link to generate your new password ${process.env.CLIENT_URL}/reset-password/${token}`,
            };
        
            await transporter.sendMail(receiver);
        
            return res.status(200).send({
              message: "Password reset link send successfully on your gmail account",
            });
          } catch (error) {
            return res.status(500).send({ message: "Something went wrong" });
          }
    };

    exports.resetPassword = async (req, res) => {
        try {
          const { token } = req.params;
          const { password } = req.body;
      
          if (!password) {
            return res.status(400).send({ message: "Please provide password" });
          }
      
          const decode = jwt.verify(token, process.env.JWT_SECRET);
      
          const user = await User.findOne({ email: decode.email });
      
          const newhashPassword = await hashPassword(password);
      
          user.password = newhashPassword;
          await user.save();
      
          return res.status(200).send({ message: "Password reset successfully" });
        } catch (error) {
          return res.status(500).send({ message: "Something went wrong" });
        }
      };
      const hashPassword = async (userPassword) => {
        const saltRound = 10;
        return await bcrypt.hash(userPassword, saltRound);
      };



      exports.changePassword = async (req, res) => {
        try {
          const { email, currentPassword, newPassword } = req.body;
      
          if (!email || !currentPassword || !newPassword) {
            return res
              .status(400)
              .send({ message: "Please provide all required fields" });
          }
      
          const checkUser = await User.findOne({ email });
      
          if (!checkUser) {
            return res
              .status(400)
              .send({ message: "User not found please register" });
          }
      
          const isMatchPassword = await comparePassword(
            currentPassword,
            checkUser.password
          );
      
          if (!isMatchPassword) {
            return res
              .status(400)
              .send({ message: "Current password does not match" });
          }
      
          const newHashPassword = await hashPassword(newPassword);
      
          await User.updateOne({ email }, { password: newHashPassword });
      
          return res.status(200).send({ message: "Password change successfully" });
        } catch (error) {
          return res.status(500).send({ message: "Something went wrong" });
        }
      };

      const comparePassword = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
      };