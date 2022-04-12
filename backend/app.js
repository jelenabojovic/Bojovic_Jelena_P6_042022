// Recupération Express et mongoose
const express = require('express');

const mongoose = require('mongoose');


const app = express();
// connection à la base données
mongoose.connect('mongodb+srv://jelenabojovic:2Ggh1ECn5YKtjYlc@cluster0.r2oqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use ((req,res) => {
    res.json({ message: 'Votre requête a bien été reçue !'});
})

module.exports = app;

