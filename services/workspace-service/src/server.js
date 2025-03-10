// src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./database");
const workspaceRoutes = require("./routes/workspaceRoutes");
const workspaceMemberRoutes = require("./routes/workspaceMemberRoutes");
const db = require("./models");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", workspaceRoutes);
app.use("/api", workspaceMemberRoutes);

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
