const mongoose = require("mongoose");

// Définir le schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Identifiant unique de l'utilisateur
  name: { type: String }, // Prenom
  surname: { type: String }, // Nom
  username: { type: String, unique: true, required: true }, //Nom d'utilisateur
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Mot de passe
});

// Créer le modèle basé sur le schéma
const User = mongoose.model("User", userSchema, "users_collection");

module.exports = User;
