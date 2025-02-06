const express = require("express");
const router = express.Router();
const path = require("path");
const verifyToken = require("../middlewares/verifyToken");

// Route pour servir la page index.html
router.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "index.html"));
});

// Ajouter d'autres routes pour des pages comme login, register, etc.
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "register.html"));
});

router.get("/index", verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "index.html"));
});

// Exporter les routes
module.exports = router;
