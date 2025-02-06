const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // Vérifie si token dans les en-têtes de la requête
  const token = req.headers["authorization"];

  // Si aucun token, retourner un message d'erreur
  if (!token) {
    return res.status(403).json({
      code: 403,
      message: "Accès interdit. Token manquant.",
    });
  }

  // Vérifier si token valide
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        code: 401,
        message: "Token invalide.",
      });
    }

    // Le token est valide, on attache l'id utilisateur à la requête
    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;
