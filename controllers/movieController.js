const Movie = require("../models/movie");

const getMovies = async (request, response) => {
  // Récupérer tous les films dans mongo
  const movies = await Movie.find();

  console.log(movies);

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
};

//URL GET by id
const getMovieById = async (request, response) => {
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
};

// Ajouter un film
const addMovie = async (request, response) => {
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
    !movieJson.release_date ||
    !movieJson.vote_average
  ) {
    return response.json({
      code: "710",
      error: "Un ou plusieurs champs est manquant",
    });
  }

  // Générer un ID aléatoire entre 100000 et 999999
  const randomId = Math.floor(Math.random() * 1000000); // Génère un nombre entre 0 et 999999

  // Vérifier si l'ID généré existe déjà dans la base
  let existingIdMovie = await Movie.findOne({ id: randomId });
  while (existingIdMovie) {
    randomId = Math.floor(Math.random() * 1000000); // Regénérer l'ID jusqu'à ce qu'il soit unique
    existingIdMovie = await Movie.findOne({ id: randomId });
  }

  // Ajouter l'ID généré dans l'objet movieJson
  movieJson.id = randomId;

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

  if (existingMovie) {
    //RG-003 : Si titre deja existant avec le même Id, code 701

    return response.json({
      code: "701",
      message: "Impossible d'ajouter un film avec un titre déjà existant",
      data: null,
    });
  }

  // Envoyer le movieJson dans MongoDB
  // -- Instancier le modele Movie avec les données --
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
};

// Modifier un film
const updateMovie = async (request, response) => {
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
    !movieJson.release_date ||
    !movieJson.vote_average
  ) {
    return response.json({
      code: "710",
      error: "Un ou pluisieurs champs est manquant",
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
};

// Supprimer un film
const deleteMovie = async (request, response) => {
  // Récupérer le film par son id
  const idParam = request.params.id;

  // Récupérer dans la base le film avec l'id saisi et supprimer
  const foundMovie = await Movie.findOneAndDelete({ id: idParam });

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
};

// Exporter toutes les fonctions
module.exports = {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
};
