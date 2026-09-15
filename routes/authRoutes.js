const express = require("express");

const {
  showRegister,
  register,
  showLogin,
  login,
  logout,
  dashboard
} = require("../controllers/authController");

const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/register", showRegister);
router.post("/register", register);

router.get("/login", showLogin);
router.post("/login", login);

router.post("/logout", logout);

router.get("/dashboard", requireAuth, dashboard);

module.exports = router;