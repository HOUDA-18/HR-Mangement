const {User, UserSchema} = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const roles = require('../models/rolesEnum')
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