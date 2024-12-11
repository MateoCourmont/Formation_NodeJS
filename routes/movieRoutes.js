const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// Routes pour les films
router.get("/movies", movieController.getMovies);
router.get("/movie/:id", movieController.getMovieById);
router.post("/save-movie", movieController.addMovie);
router.put("/movie/:id", movieController.updateMovie);
router.delete("/movie/:id", movieController.deleteMovie);

module.exports = router;
