const Sauce = require('../models/Sauces');

//Importer le package fs pour pouvoir supprimer des fichiers par la route DELETE
const fs = require('fs');

//creation d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce ({
    //Utilise le schéma de sauce de mongoose
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked :[''],
        usersDisliked :['']
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));

    console.log(sauce);
};
// Affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({error: error }));
};
//Affichage des sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    
  .catch((error) => res.status(400).json({error: error}));
 }

// modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,

    }
    :{...req.body};

    Sauce.updateOne (
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
     )
     .then(() => res.status(200).json({ message: "Sauce modifié" }))
     .catch((error) => res.status(400).json({ error }));
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'sauce supprimée !'}))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  };

  // like & dislike
  exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
    if(like === 1) {
        Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous aimez cette sauce' }))
        
        .catch( error => res.status(400).json({ error}))
    
      } else if(like === -1) { 
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: `Vous n'aimez pas cette sauce`}))
        .catch( error => res.status(400).json({ error}))
      
      } else {  
        Sauce.findOne( {_id: req.params.id})
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
                .then( () => res.status(200).json({ message: `Vous n'aimez plus cette sauce` }))
                .catch( error => res.status(400).json({ error}))
                }
                else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                  Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
                  .then( () => res.status(200).json({ message: 'Vous pourriez aimer cette sauce maintenant'}))
                  .catch( error => res.status(400).json({ error}))
                  }           
          })
          .catch( error => res.status(400).json({ error}))             
      }   
    };


