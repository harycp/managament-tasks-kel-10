// src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");
const db = require("./models");

require("../src/workers/worker");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Ganti sesuai origin frontend
    credentials: true, // Wajib agar cookie bisa dikirim
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
    await db.sequelize.sync({ alter: true });
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

startServer();
