const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./config/db.json');
const { default: axios } = require('axios');
const congesRouter = require('./routes/congesRoute');
const cron = require("node-cron");
const statisticsController = require("./controllers/statisticsController");


const complaintRoutes = require("./routes/complaintRoutes");
const statisticsRoutes = require("./routes/statisticsRoute");
require('dotenv').config()
// Configuration initiale

const app = express();
const server = http.createServer(app);
const {Server}= require('socket.io')

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
// Connexion MongoDB
mongoose
  .connect(db.mongo.uri)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

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

const connectedUsers = new Map();

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('register_user', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`${userId} registered with socket ${socket.id}`);
    console.log("connectedUsers", connectedUsers)
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

app.use("/api/complaints", complaintRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use('/api/conges', congesRouter); 
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


server.listen(8070, () => {
  console.log("====================================");
  console.log("server is running");
  console.log("====================================");
});
cron.schedule("* * * * *", async () => {
  try {
    await statisticsController.genererStatistics();
    console.log("Statistiques générées avec succès.");
  } catch (error) {
    console.error("Erreur lors de la génération des statistiques :", error);
  }
});
