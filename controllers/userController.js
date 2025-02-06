const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const postUserRegistration = async (request, response) => {
  try {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).json({
        code: 400,
        message: "Tous les champs sont obligatoires.",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return response.status(400).json({
        code: 400,
        message: "Cet email est déjà utilisé.",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return response.status(400).json({
        code: 400,
        message: "Ce nom d'utilisateur est déjà utilisé.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let randomId = Math.floor(Math.random() * 1000000);
    let existingIdUser = await User.findOne({ id: randomId });

    while (existingIdUser) {
      randomId = Math.floor(Math.random() * 1000000);
      existingIdUser = await User.findOne({ id: randomId });
    }

    const user = new User({
      id: randomId,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    return response.status(200).json({
      code: 200,
      message: "Utilisateur enregistré avec succès.",
      loginRedirect: "/pages/login",
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    return response.status(500).json({
      code: 500,
      message: "Erreur interne du serveur.",
    });
  }
};

const postUserLogin = async (request, response) => {
  try {
    const { username, password } = request.body;

    // Vérifier si tous les champs sont remplis
    if (!username || !password) {
      return response.status(400).json({
        code: 400,
        message: "Tous les champs sont obligatoires.",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return response.status(401).json({
        code: 401,
        message: "Nom d'utilisateur ou mot de passe incorrect.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response.status(401).json({
        code: 401,
        message: "Nom d'utilisateur ou mot de passe incorrect.",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Réponse réussie
    return response.status(200).json({
      code: 200,
      token,
      message: "Authentification réussie.",
      redirectUrl: "/pages/index",
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return response.status(500).json({
      code: 500,
      message: "Erreur interne du serveur. Veuillez réessayer.",
    });
  }
};

// Exporter toutes les fonctions
module.exports = {
  postUserRegistration,
  postUserLogin,
};
