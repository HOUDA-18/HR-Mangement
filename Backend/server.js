const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./config/db.json');
const { default: axios } = require('axios');


require('dotenv').config()
// Configuration initiale

const app = express();
const server = http.createServer(app);
const {Server}= require('socket.io')

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.json())
// Connexion MongoDB
mongoose.connect(db.mongo.uri)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

  const io = new Server(server, {
    cors: {
      origin: 'http://127.0.0.1:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  app.use((req,res,next)=>{
    req.io = io;
    next();
})

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

require("./routes/routes")(app); 

app.get('/',async (req,res)=>{
  const code = req.query.code;

  try{
      const response = await axios.post('https://zoom.us/oauth/token',null, {
          params:{
              grant_type: 'authorization_code',
              code:code,
              redirect_uri: process.env.REDIRECT_URI
          },
          headers:{
              'Authorization':`Basic ${Buffer.from(`${process.env.ZOOM_API_KEY}:${process.env.ZOOM_API_SECRET}`).toString('base64')}`
          }
      });
      res.send(response.data.access_token);    
  }catch(error){
      console.error('Error',error);
      res.send('Error');
  }
  
});

server.listen(8070,()=>{
  console.log('====================================');
  console.log("server is running");
  console.log('====================================');
});