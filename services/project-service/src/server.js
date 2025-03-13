// src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./database");
const db = require("./models");

const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", boardRoutes);
app.use("/api", listRoutes);

const PORT = process.env.PORT || 5000;

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
