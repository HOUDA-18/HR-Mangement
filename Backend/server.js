const express= require('express')
const http= require('http')
const userRoutes = require('./routes/userRoute');
const db = require('./config/db.json')
const mongoose = require('mongoose')
const cors = require('cors');
const app = express()
const server = http.createServer(app)

//connexion a la base de données
mongoose.connect(db.mongo.uri)
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/api', userRoutes);
server.listen(5000,()=>{
    console.log('====================================');
    console.log("server is running");
    console.log('====================================');
});