const errorHandler = (err, request, response, next) => {
  console.error(err.stack);
  response.status(500).json({ message: "Erreur du serveur" });
};

module.exports = errorHandler;
