const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", authController.register);
router.post("/signin", authController.login);

// Protected route
router.get("/verify", authMiddleware.verifyToken, authController.verify);

module.exports = router;
