const express= require('express')
const http= require('http')

const db = require('./config/db.json')
const mongoose = require('mongoose')

const app = express()
const server = http.createServer(app)

//connexion a la base de données
mongoose.connect(db.mongo.uri)

app.use(express.json())
app.use(express.urlencoded({extended: false}));

server.listen(3000,()=>{
    console.log('====================================');
    console.log("server is running");
    console.log('====================================');
});