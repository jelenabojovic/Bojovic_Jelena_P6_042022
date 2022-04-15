// Recupération Express et mongoose
const express = require('express');
const mongoose = require('mongoose');

//Import le fichier de variables d'environnement
const dotenv = require("dotenv");

// OWASP
const helmet = require("helmet"); // Sécurisation des en-tête 

//Import path (pour le dossier static 'images')
const path = require('path');

// Recupération des routes

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

//Import le fichier de variables d'environnement
dotenv.config();

// Connection à la base données
mongoose.connect(process.env.MONGO_URI,
  //Utilise .env pour cacher les identifiants de connexion
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Securité  OWASP
app.use(helmet()); //Configuration des en-têtes HTTP
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.disable("x-powered-by");

app.use(express.json());

//Middleware pour acceder a l'API depuis n'importe quelle origine
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });


 // affichage des images 
 app.use("/images", express.static(path.join(__dirname,'images')))

//Défini le chemin de la route des sauces et users
app.use('/api/sauces',sauceRoutes);
app.use('/api/auth', userRoutes);

app.use ((req,res) => {
    res.json({ message: 'Votre requête a bien été reçue !'});
})

module.exports = app;

