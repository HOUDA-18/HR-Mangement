const express= require('express')
const http= require('http')
var cors = require('cors')

const db = require('./config/db.json')
const mongoose = require('mongoose')
const app = express()
const server = http.createServer(app)

//connexion a la base de données
mongoose.connect(db.mongo.uri)
  .then(async () => {
    console.log('Connected to MongoDB')});
app.use(cors()) 

app.use(express.json())
app.use(express.urlencoded({extended: false}));

require("./routes/routes")(app);

server.listen(8070,()=>{
    console.log('====================================');
    console.log("server is running");
    console.log('====================================');
});
