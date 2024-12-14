const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const postUserRegistration = async (request, response) => {
  try {
    const { username, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un ID aléatoire entre 100000 et 999999
    let randomId = Math.floor(Math.random() * 1000000);

    // Vérifier si l'ID généré existe déjà dans la base
    let existingIdUser = await User.findOne({ id: randomId });
    while (existingIdUser) {
      randomId = Math.floor(Math.random() * 1000000); // Regénérer l'ID jusqu'à ce qu'il soit unique
      existingIdUser = await User.findOne({ id: randomId }); // Mettre à jour la recherche
    }

    // Créer un nouvel utilisateur
    const user = new User({
      id: randomId,
      username,
      email,
      password: hashedPassword,
    });

    //Persister le user
    await user.save();
    console.log("Utilisateur sauvegardé avec succès");

    // Réponse réussie
    response.json({
      code: "200",
      message: "Utilisateur enregistré avec succès",
      loginRedirect: "/pages/login",
      data: { user },
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
    response.json({
      code: "500",
      message: "Erreur interne du serveur",
    });
  }
};

const postUserLogin = async (request, response) => {
  try {
    const { username, password } = request.body;
    const user = await User.findOne({ username });
    if (!user) {
      return response.json({
        message: "Authentifiction failed",
        code: 401,
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response.json({
        message: "Authentifiction failed",
        code: 401,
      });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Réponse réussie
    response.json({
      token,
      code: 200,
      message: "Authentification suceed",
      redirectUrl: "https://www.wikipedia.org",
    });
  } catch (error) {
    console.error(error);
    response.json({
      code: "500",
      message: "Login failed",
    });
  }
};

// Exporter toutes les fonctions
module.exports = {
  postUserRegistration,
  postUserLogin,
};
