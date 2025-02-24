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

exports.import= async (req,res)=>{

    //const { firstname, lastname, matricule, email, password} = req.body
    const users= req.body
    const usersToInsert=[]

    if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      for (let user of users) {
        if (await User.findOne({matricule: user.matricule}) || await User.findOne({email: user.email})) {
            users.filter((u)=>u.email!==user.email)
            break;
        }
        user.password= (await bcrypt.hash(user.password, 10)).toString()
        

        const existingUser = await User.findOne({ 
            $or: [{ email: user.email }, { matricule: user.matricule }]
          });
        if (!existingUser) {
            // Hash password before saving
    
            usersToInsert.push({
              firstname: user.firstname.trim(),
              lastname: user.lastname.trim(),
              email: user.email.trim(),
              matricule: user.matricule.trim(),
              password: (await bcrypt.hash(user.password, 10)).toString(), // Store the hashed password
              active: false,
              role: roles.EMPLOYEE
            });
          }
      }
      if(usersToInsert.length >0){
        await User.insertMany(users);
        res.json({ message: "Users imported successfully" });
      }else{
        res.json({ message: "Nothing to import" });

      }

}