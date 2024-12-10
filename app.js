// Importer le module express
const express = require("express");
// Importer le module mongoose
const mongoose = require("mongoose");

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

// Créer le schema
const Article = mongoose.model(
  "Article",
  { title: String, content: String, author: String },
  "articles_collection"
);

// Instancier le server grace à express
const app = express();

// Autoriser le back à recevoir des données dans le body
app.use(express.json());

// Une route / un point d'entrée
app.get("/articles", async (request, response) => {
  // Récupérer tous les produits dans mongo
  const articles = await Article.find();

  if (articles.length == 0) {
    // si liste vide, retourner code 701
    return response.json({
      code: "701",
      message: "La liste des articles est vide",
      data: null,
    });
  }

  // RG-001 : Récupérer les articles
  return response.json({
    code: "200",
    message: "La liste des articles a été récupérés avec succès",
    data: articles,
  });
});

//URL GET by id
app.get("/article/:id", async (request, response) => {
  // Récupérer le produit par son id
  const idParam = request.params.id;

  // // RG-002 : récupérer l'article trouvé
  const foundArticle = await Article.findOne({ _id: idParam });

  //RG-002 : Si l'id n'existe pas en base ; code 702
  if (!foundArticle) {
    return response.json({
      code: "702",
      message: "Impossible de récupérer un article avec l'UID: " + idParam,
      data: null,
    });
  }

  return response.json({
    code: "200",
    message: "Article récupéré avec succès",
    data: foundArticle,
  });
});

// Ajouter un article
app.post("/save-article", async (request, response) => {
  // Récupérer la requête
  const articleJson = request.body;

  // Vérifier si le titre existe déjà dans la base
  const existingArticle = await Article.findOne({ title: articleJson.title });

  // Contrôle de surface
  if (!articleJson.title || !articleJson.content || !articleJson.author) {
    return response.json({
      code: "710",
      error: "Un des champs est manquant",
    });
  }

  if (typeof articleJson.title != "string") {
    return response.json({
      code: "710",
      error: "Le champs title doit être une châine de caractère",
    });
  }

  if (typeof articleJson.content != "string") {
    return response.json({
      code: "710",
      error: "Le champs content doit être une châine de caractère",
    });
  }

  if (typeof articleJson.author != "string") {
    return response.json({
      code: "710",
      error: "Le champs author doit être une châine de caractère",
    });
  }

  if (existingArticle) {
    //RG-003 : Si titre deja existant, code 701

    return response.json({
      code: "701",
      message: "Impossible d'ajouter un article avec un titre déjà existant",
      data: null,
    });
  }

  // Envoyer le articleJson dans MongoDB
  // -- Instancier le modele Article avec les données --
  const newArticle = new Article(articleJson);

  // Ajouter l'article dans la base de données (persister en base)
  await newArticle.save();

  //RG-003 : Ajouter un article

  // Retourner un json
  return response.json({
    code: "200",
    message: "Article ajouté avec succès",
    data: articleJson,
  });
});

// Modifier un article
app.put("/article/:id", async (request, response) => {
  const articleJson = request.body;

  // Récupérer l'article par son id
  const idParam = request.params.id;

  // Vérifier si le titre existe déjà dans la base
  const existingArticle = await Article.findOne({ title: articleJson.title });

  // Contrôle de surface
  if (!articleJson.title || !articleJson.content || !articleJson.author) {
    return response.json({
      code: "710",
      error: "Un des champs est manquant",
    });
  }

  if (typeof articleJson.title != "string") {
    return response.json({
      code: "710",
      error: "Le champs title doit être une châine de caractère",
    });
  }

  if (typeof articleJson.content != "string") {
    return response.json({
      code: "710",
      error: "Le champs content doit être une châine de caractère",
    });
  }

  if (typeof articleJson.author != "string") {
    return response.json({
      code: "710",
      error: "Le champs author doit être une châine de caractère",
    });
  }

  // RG-004 : Si titre deja existant, code 701
  if (existingArticle) {
    return response.json({
      code: "701",
      message: "Impossible de modifier un article avec un titre déjà existant",
      data: null,
    });
  }

  // RG-004 : récupérer l'article trouvé et le modifier
  const foundArticle = await Article.findOneAndUpdate(
    { _id: idParam },
    articleJson,
    { new: true, runValidators: true }
  );

  //RG-004 : Si l'id n'existe pas en base ; code 702
  if (!foundArticle) {
    return response.json({
      code: "702",
      message:
        "Impossible de récupérer un article et le modifier avec l'UID inexistant: " +
        idParam,
      data: null,
    });
  }

  //RG-004 : si modifié avec succès

  return response.json({
    code: "200",
    message: "Article modifié avec succès",
    data: foundArticle,
  });
});

// Supprimer un article
app.delete("/article/:id", async (request, response) => {
  // Récupérer l'article par son id
  const idParam = request.params.id;

  // Récupérer dans la base l'article avec l'id saisi et supprimer
  const foundArticle = await Article.findByIdAndDelete({ _id: idParam });

  // RG-005 : Si l'id n'existe pas en base code 708
  if (!foundArticle) {
    return response.json({
      code: "702",
      message: "Impossible de supprimer un article un UID inexistant",
      data: null,
    });
  }

  // RG-005Retourner une confirmation de suppression, code 200
  return response.json({
    code: "200",
    message: "Article supprimé avec succès",
    data: foundArticle,
  });
});

// Lancer le serveur
app.listen(3000, () => {
  console.log("Le serveur a démarré");
});
