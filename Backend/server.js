const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./config/db.json');

// Configuration initiale

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.json())
// Connexion MongoDB
mongoose.connect(db.mongo.uri)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));


require("./routes/routes")(app); 


server.listen(8070,()=>{
  console.log('====================================');
  console.log("server is running");
  console.log('====================================');
});