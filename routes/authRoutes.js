const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.postUserRegistration);
router.post("/login", userController.postUserLogin);

// Exporter les routes
module.exports = router;
