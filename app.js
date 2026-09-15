const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

connectDB();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/", authRoutes);

app.use((req, res) => {
  res.status(404).render("error", {
    message: "Page not found"
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).render("error", {
    message: error.message || "Something went wrong"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});