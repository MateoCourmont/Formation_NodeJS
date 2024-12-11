// Importer les modules
const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Quand je suis connecté à la bdd (evenementiel)
mongoose.connection.once("open", () => {
  console.log("Connexion à la base de données effectuée");
});

// Quand la bdd aura des erreurs
mongoose.connection.on("error", () => {
  console.log("Erreur dans la BDD");
});

// Se connecter sur mongodb (async)
// Ca prend x temps à s'executer
mongoose.connect("mongodb://localhost:27017/db_articles");

// Définir le schéma pour les films
const movieSchema = new mongoose.Schema({
  id: { type: Number, unique: true, default: uuidv4 }, // Identifiant unique du film
  title: { type: String }, // Titre du film
  genres: { type: String }, // Genres
  cast: { type: String }, // Liste des acteurs
  director: { type: String }, // Réalisateur
  keywords: { type: String }, // Mots-clés
  runtime: { type: Number }, // Durée en minutes
  release_date: { type: Date }, // Date de sortie
  vote_average: { type: Number }, // Note moyenne
});

movieSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Vérifier si l'ID généré existe déjà dans la base
    const existingMovie = await mongoose
      .model("Movie")
      .findOne({ id: this.id });
    if (existingMovie) {
      // Si un doublon est détecté, générer un nouvel ID
      this.id = uuidv4();
    }
  }
  next();
});

// Créer le modèle basé sur le schéma
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;

// // Créer le schema
// const userSchema = mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, "Etrez un email"],
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Entrez un mot de passe"],
//   },
// });

// // Enregistrer le modèle et définir explicitement la collection
// const User = mongoose.model("User", userSchema, "user_list");

// // Créer une instance utilisateur
// const newUser = new User({ email, password });

// Instancier le server grace à express
const app = express();

// Autoriser le back à recevoir des données dans le body
app.use(express.json());

// Une route / un point d'entrée
app.get("/movies", async (request, response) => {
  // Récupérer tous les films dans mongo
  const movies = await Movie.find();

  if (movies.length == 0) {
    // si liste vide, retourner code 701
    return response.json({
      code: "701",
      message: "La liste des films est vide",
      data: null,
    });
  }

  // RG-001 : Récupérer les films
  return response.json({
    code: "200",
    message: "La liste des films a été récupérés avec succès",
    data: movies,
  });
});

//URL GET by id
app.get("/movies/:id", async (request, response) => {
  // Récupérer le film par son id
  const idParam = request.params.id;

  // // RG-002 : récupérer le film trouvé
  const foundMovie = await Movie.findOne({ id: idParam });

  //RG-002 : Si l'id n'existe pas en base ; code 702
  if (!foundMovie) {
    return response.json({
      code: "702",
      message: "Impossible de récupérer un film avec l'UID: " + idParam,
      data: null,
    });
  }

  return response.json({
    code: "200",
    message: "Film récupéré avec succès",
    data: foundMovie,
  });
});

// Ajouter un film
app.post("/save-movie", async (request, response) => {
  // Récupérer la requête
  const movieJson = request.body;

  // Vérifier si le titre existe déjà dans la base
  const existingMovie = await Movie.findOne({ title: movieJson.title });

  // Contrôle de surface
  if (
    !movieJson.title ||
    !movieJson.genres ||
    !movieJson.cast ||
    !movieJson.director ||
    !movieJson.keywords ||
    !movieJson.runtime ||
    !moviesJson.release_date ||
    !movieJson.vote_average
  ) {
    return response.json({
      code: "710",
      error: "Un des champs est manquant",
    });
  }

  if (typeof movieJson.title != "string") {
    return response.json({
      code: "710",
      error: "Le champs title doit être une châine de caractère",
    });
  }

  if (typeof movieJson.genres != "string") {
    return response.json({
      code: "710",
      error: "Le champs genres doit être une châine de caractère",
    });
  }

  if (typeof movieJson.cast != "string") {
    return response.json({
      code: "710",
      error: "Le champs cast doit être une châine de caractère",
    });
  }

  if (existingMovie && existingMovie.id.toString() !== idParam) {
    //RG-003 : Si titre deja existant avec le même Id, code 701

    return response.json({
      code: "701",
      message: "Impossible d'ajouter un film avec un titre déjà existant",
      data: null,
    });
  }

  // Envoyer le movieJson dans MongoDB
  // -- Instancier le modele Article avec les données --
  const newMovie = new Movie(movieJson);

  // Ajouter le film dans la base de données (persister en base)
  await newMovie.save();

  //RG-003 : Ajouter un film

  // Retourner un json
  return response.json({
    code: "200",
    message: "Film ajouté avec succès",
    data: movieJson,
  });
});

// Modifier un film
app.put("/movie/:id", async (request, response) => {
  const movieJson = request.body;

  // Récupérer le film par son id
  const idParam = request.params.id;

  // Vérifier si le titre existe déjà dans la base
  const existingMovie = await Movie.findOne({ title: movieJson.title });

  // Contrôle de surface
  if (
    !movieJson.title ||
    !movieJson.genres ||
    !movieJson.cast ||
    !movieJson.director ||
    !movieJson.keywords ||
    !movieJson.runtime ||
    !moviesJson.release_date ||
    !movieJson.vote_average
  ) {
    return response.json({
      code: "710",
      error: "Un des champs est manquant",
    });
  }

  if (typeof movieJson.title != "string") {
    return response.json({
      code: "710",
      error: "Le champs title doit être une châine de caractère",
    });
  }

  if (typeof movieJson.genres != "string") {
    return response.json({
      code: "710",
      error: "Le champs genres doit être une châine de caractère",
    });
  }

  if (typeof movieJson.cast != "string") {
    return response.json({
      code: "710",
      error: "Le champs cast doit être une châine de caractère",
    });
  }

  // RG-004 : Si titre deja existant, code 701
  if (existingMovie) {
    return response.json({
      code: "701",
      message: "Impossible de modifier un film avec un titre déjà existant",
      data: null,
    });
  }

  // RG-004 : récupérer le film trouvé et le modifier
  const foundMovie = await Movie.findOneAndUpdate({ id: idParam }, movieJson, {
    new: true,
    runValidators: true,
  });

  //RG-004 : Si l'id n'existe pas en base ; code 702
  if (!foundMovie) {
    return response.json({
      code: "702",
      message:
        "Impossible de récupérer un film et le modifier avec l'UID inexistant: " +
        idParam,
      data: null,
    });
  }

  //RG-004 : si modifié avec succès

  return response.json({
    code: "200",
    message: "Film modifié avec succès",
    data: foundMovie,
  });
});

// Supprimer un film
app.delete("/movie/:id", async (request, response) => {
  // Récupérer le film par son id
  const idParam = request.params.id;

  // Récupérer dans la base le film avec l'id saisi et supprimer
  const foundMovie = await Movie.findByIdAndDelete({ id: idParam });

  // RG-005 : Si l'id n'existe pas en base code 708
  if (!foundMovie) {
    return response.json({
      code: "702",
      message: "Impossible de supprimer un film un UID inexistant",
      data: null,
    });
  }

  // RG-005 : Retourner une confirmation de suppression, code 200
  return response.json({
    code: "200",
    message: "Film supprimé avec succès",
    data: foundMovie,
  });
});

// Lancer le serveur
app.listen(3000, () => {
  console.log("Le serveur a démarré");
});
