// src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./database");
const db = require("./models");
const cookieParser = require("cookie-parser");

const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");

dotenv.config();

// Worker
require("./workers/userEventWorker");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", boardRoutes);
app.use("/api", listRoutes);

const PORT = process.env.PORT || 5000;

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
