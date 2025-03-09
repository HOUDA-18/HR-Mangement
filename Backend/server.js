const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User } = require('./models/user');
const roles = require('./models/rolesEnum');
const db = require('./config/db.json');

// Configuration initiale
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Connexion MongoDB
mongoose.connect(db.mongo.uri)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Chargement des modèles IA
const MODEL_PATH = path.join(__dirname, 'models');
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH),
  faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH)
]).then(() => console.log('🤖 Modèles IA chargés'))
  .catch(err => console.error('💥 Erreur modèles IA:', err));

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
app.post('/signupface', upload.single('imageData'), async (req, res) => {
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

    // Création de l'utilisateur
    const user = new User({
      firstname,
      lastname,
      matricule,
      email,
      phone,
      image: imageData,
      faceDescriptor,
      password: await bcrypt.hash(password, 10),
      role
    });

    await user.save();
    res.status(201).json({ message: 'Utilisateur enregistré' });

  } catch (error) {
    console.error('Erreur inscription:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route de connexion
app.post('/loginface', async (req, res) => {
  try {
    const { imageData } = req.body;
    const capturedDescriptor = await extractFaceDescriptor(imageData);
    const users = await User.find();

    // Recherche de la meilleure correspondance
    let closestUser = null;
    let minDistance = Infinity;
    
    for (const user of users) {
      const distance = faceapi.euclideanDistance(capturedDescriptor, user.faceDescriptor);
      if (distance < minDistance) {
        minDistance = distance;
        closestUser = user;
      }
    }

    if (minDistance > 0.4) throw new Error('Aucune correspondance');
    
    res.json({
      user: {
        firstname: closestUser.firstname,
        lastname: closestUser.lastname,
        email: closestUser.email,
        role: closestUser.role
      }
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 8070;
server.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur http://localhost:${PORT}`);
});