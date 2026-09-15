const bcrypt = require("bcrypt");
const User = require("../models/User");

const showRegister = (req, res) => {
  res.render("auth/register");
};

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render("error", {
        message: "Username and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).render("error", {
        message: "Password must be at least 8 characters"
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).render("error", {
        message: "Username already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      passwordHash
    });

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

const showLogin = (req, res) => {
  res.render("auth/login");
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).render("error", {
        message: "Invalid username or password"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).render("error", {
        message: "Invalid username or password"
      });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.redirect("/login");
  });
};

const dashboard = (req, res) => {
  res.render("dashboard", {
    username: req.session.username
  });
};

module.exports = {
  showRegister,
  register,
  showLogin,
  login,
  logout,
  dashboard
};