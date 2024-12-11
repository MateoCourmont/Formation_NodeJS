const mongoose = require("mongoose");

// Définir le schéma pour les films
const movieSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Identifiant unique du film
  title: { type: String }, // Titre du film
  genres: { type: String }, // Genres
  cast: { type: String }, // Liste des acteurs
  director: { type: String }, // Réalisateur
  keywords: { type: String }, // Mots-clés
  runtime: { type: Number }, // Durée en minutes
  release_date: { type: Date }, // Date de sortie
  vote_average: { type: Number }, // Note moyenne
});

// Créer le modèle basé sur le schéma
const Movie = mongoose.model("Movie", movieSchema, "movies_collection");

module.exports = Movie;
