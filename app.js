// Importer les modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const movieRoutes = require("./routes/movieRoutes");
const viewsRoutes = require("./routes/viewsRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

// Instancier le server grace à express
const app = express();

// Autoriser le back à recevoir des données dans le body
app.use(express.json());

// Servir les fichiers statiques (images, styles, etc.) depuis le dossier assets
app.use("/assets", express.static(path.join(__dirname, "views", "assets")));

// Routes
app.use("/api", movieRoutes);
app.use("/api", authRoutes);
app.use("/pages", viewsRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

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
mongoose.connect(process.env.MONGODB_URL);

// Lancer le serveur
app.listen(process.env.PORT, () => {
  console.log("Le serveur a démarré");
});
