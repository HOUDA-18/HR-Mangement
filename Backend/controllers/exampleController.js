const {User, UserSchema} = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

exports.login= async (req,res)=>{
    const {matricule, password} = req.body
    const user = await User.findOne({matricule:matricule})
    if (user == null) {
        return res.status(400).json('Cannot find user')
    }
    try {
        const id = user.id;
        bcrypt.compare(password, user.password, (err, ress)=>{
        const token= jwt.sign({id}, "jwtSecret")
         if(ress ) {
            res.status(200).json({user: user,
                  token: token
                })
            }
            else{
                res.status(405).json({message: "Not Allowed"}) 
            }
        }) 
            
       
    } catch (err){
        res.status(500).json({error: err})
    }
}

exports.register= async (req,res)=>{
    const {matricule, password} = req.body
    const u = new User({
        matricule: matricule,
        password: (await bcrypt.hash(password, 10)).toString()
    })
    const user = await User.create(u)
    if (user == null) {
        return res.status(400).json('Cannot find user')
    }else{
        return res.status(201).json({user: user})
    }

}