// Recupération Express et mongoose
const express = require('express');

const mongoose = require('mongoose');
const dotenv = require("dotenv");

// Recupération des routes

const userRoutes = require('./routes/user');



const app = express();

////Import le fichier de variables d'environnement
dotenv.config();

// Connection à la base données
mongoose.connect(process.env.MONGO_URI,
  //Utilise .env pour cacher les identifiants de connexion
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

//Middleware pour acceder a l'API depuis n'importe quelle origine
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

 //Défini le chemin de la route des users
app.use('/api/auth', userRoutes);

app.use ((req,res) => {
    res.json({ message: 'Votre requête a bien été reçue !'});
})

module.exports = app;

