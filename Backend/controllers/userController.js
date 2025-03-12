const {User, UserSchema} = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
const path = require("path");
const roles = require('../models/rolesEnum');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Joi = require("joi");
require("dotenv").config();
const multer = require('multer');

// Configuration initiale
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const upload = multer({ storage: multer.memoryStorage() });
// Chargement des modèles IA
const MODEL_PATH = path.join(__dirname, '../models');
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH),
  faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH)
]).then(() => console.log('🤖 Modèles IA chargés'))
  .catch(err => console.error('💥 Erreur modèles IA:', err));
  // Fonction pour vérifier le format de l'image
function isSupportedImageType(imageData) {
  const base64Regex = /data:image\/(jpeg|png);base64,/;
  const match = imageData.match(base64Regex);
  
  if (!match) {
    console.error('❌ Format d\'image non valide');
    return false;
  }

  const fileType = match[1];
  console.log("📂 Type d'image détecté :", fileType);
  return ['jpeg', 'png'].includes(fileType);
}


// Fonction d'extraction du descripteur facial
const extractFaceDescriptor = async (imageData) => {
  try {
    const buffer = Buffer.from(imageData.split(',')[1], 'base64');
    const img = await canvas.loadImage(buffer);
    const canvasObj = faceapi.createCanvasFromMedia(img);
    const detections = await faceapi
      .detectAllFaces(canvasObj)
      .withFaceLandmarks()
      .withFaceDescriptors();
      
    return Array.from(detections[0].descriptor); // Conversion critique
  } catch (error) {
    throw new Error(`Erreur extraction visage: ${error.message}`);
  }
};

// Route d'inscription
exports.signupface = async (req, res) => {
  try {
    const { 
      firstname,
      lastname,
      matricule,
      email,
      phone,
      password,
      role = roles.EMPLOYEE
      
    } = req.body;

    // Validation du rôle
    if (!Object.values(roles).includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    // Traitement de l'image
    const imageData = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;
    const faceDescriptor = await extractFaceDescriptor(imageData);
    const faceDescriptorArray = Array.from(faceDescriptor);
    // Création de l'utilisateur
    const user = new User({
      firstname,
      lastname,
      matricule,
      email,
      phone,
      image: imageData,
      faceDescriptor: faceDescriptorArray,
      password: await bcrypt.hash(password, 10),
      role
    });

    await user.save();
    res.status(201).json({ message: 'Utilisateur enregistré' });

  } catch (error) {
    console.error('Erreur inscription:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.loginface = async (req, res) => {
  try {
    const { imageData } = req.body;

    // 1. Vérification de base de l'image
    if (!imageData?.startsWith('data:image/jpeg;base64')) {
      throw new Error('Format image invalide (JPEG requis)');
    }

    // 2. Extraction du descripteur facial
    const capturedDescriptor = await extractFaceDescriptor(imageData);
    console.log('🔍 Descripteur capturé:', capturedDescriptor.length, 'éléments');

    // 3. Récupération des utilisateurs avec vérification
    const users = await User.find({ faceDescriptor: { $exists: true, $ne: null } });
    if (users.length === 0) throw new Error('Aucun utilisateur enregistré');

    // 4. Recherche de correspondance
    let closestUser = null;
    let minDistance = Infinity;

    for (const user of users) {
      try {
        // Conversion du tableau stocké vers Float32Array
        const storedDescriptor = new Float32Array(user.faceDescriptor);
        
        

        // Calcul de la distance
        const distance = faceapi.euclideanDistance(capturedDescriptor, storedDescriptor);
        console.log(`📊 ${user.email} - Distance: ${distance.toFixed(4)}`);

        if (distance < minDistance) {
          minDistance = distance;
          closestUser = user;
        }
      } catch (e) {
        console.error(`🚨 Erreur avec ${user.email}: ${e.message}`);
      }
    }

    // 5. Vérification finale
    if (!closestUser || minDistance > 0.6) { // Seuil ajusté à 0.6
      throw new Error(`Aucune correspondance valide (meilleure distance: ${minDistance.toFixed(2)})`);
    }

    // 6. Réponse réussie
    res.json({
      user: {
        firstname: closestUser.firstname,
        lastname: closestUser.lastname,
        email: closestUser.email,
        role: closestUser.role
      },
      confidence: (1 - minDistance).toFixed(2) // Indice de confiance
    });

  } catch (error) {
    console.error('❌ Erreur connexion:', error.message);
    res.status(401).json({ 
      error: error.message,
      details: error.message.includes('distance') ? null : error.stack 
    });
  }
};

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

    const { firstname, lastname, matricule, email,phone,image,  password} = req.body
     // Traitement de l'image
     if (!req.file) {
      return res.status(400).json("Image obligatoire");
    }
    const imageData = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;

    // Extraction du descripteur facial
    const faceDescriptor = await extractFaceDescriptor(imageData);
    const faceDescriptorArray = Array.from(faceDescriptor);
    const u = new User({
        firstname: firstname,
        lastname: lastname,
        matricule: matricule,
        email: email,
        phone: phone,
        image: `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`,
        faceDescriptor: faceDescriptorArray,
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

         const existingUser = await User.findOne({ 
            $or: [{ email: user.email }, { matricule: user.matricule }]
          });
        if (!existingUser) { 
    
            usersToInsert.push({
              firstname: user.firstname.trim(),
              lastname: user.lastname.trim(),
              phone: user.phone.trim(),
              image: user.image.trim(),
              email: user.email.trim(),
              matricule: user.matricule.trim(),
              password: (await bcrypt.hash(user.password, 10)).toString(), // Store the hashed password
              active: false,
              role: roles.EMPLOYEE
            });
         }
      }

      if(usersToInsert.length >0){
        await User.insertMany(usersToInsert);
        res.json({ message: "Users imported successfully",
                   users: usersToInsert });
      }else{
        res.json({ message: "Nothing to import" });

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
              html: `Click on <a href="${process.env.CLIENT_URL}/${token}">this link</a> to generate your new password.`,
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

exports.getEmployees = async (req, res) => {
    try {
    
        const employees = await User.find({ role: 'EMPLOYEE' }, ' firstname lastname email matricule role active telephone departement');
        
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
    
        const users = await User.find({  },  'firstname lastname email role active telephone departement');
        
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRHMembers = async (req, res) => {
    try {
        const rhMembers = await User.find({$or:[{role: 'MEMBRE_HR'},{role: "ADMIN_HR"}]  }, 'firstname lastname email role active telephone departement');
        res.status(200).json( rhMembers );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update= async (req,res)=>{
  const { id } = req.params;
  const { firstname, lastname, matricule, email,phone,image} = req.body
  try {
      const updatedProfile = await User.findOneAndUpdate(
        {_id:id},
        { firstname, lastname, matricule, email,phone,image },
        { new: true, runValidators: true }
      );
  
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', data: updatedProfile });
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ message: 'Error updating profile', error: err });
    }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendVerificationCode = async (req, res) => {

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
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
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
      subject: "Verification code",
      html: `Verification code : ${verificationCode}`,
    };

    await transporter.sendMail(receiver);

    return res.status(200).json({
      code:verificationCode      
    });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

