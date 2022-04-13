// Recupération Express et mongoose
const express = require('express');

const mongoose = require('mongoose');
const dotenv = require("dotenv");


const app = express();

//Variable d'environnement
dotenv.config();

// connection à la base données
mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });
 

app.use ((req,res) => {
    res.json({ message: 'Votre requête a bien été reçue !'});
})

module.exports = app;

