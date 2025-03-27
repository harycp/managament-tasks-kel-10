// src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("./config/passport");
const sequelize = require("./database");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");
const db = require("./models");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session & Passport
app.use(
  session({ secret: "tuntask", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await db.sequelize.sync();
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

startServer();
