const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
// const db = require("./models");
// const notificationService = require("../services/notification-service/src/server.js");
// const projectService = require("../../services/project-service/src/server.js");
// const userService = require("../../services/user-service/src/server.js");
// const workspaceService = require("../../services/workspace-service/src/server.js");

// Variabel environment dari file .env
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

// app.use("/notification/notification-service", notificationService);
app.use("/project/project-service", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:5001/api${req.url}`, // port sesuai project-service
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Internal Server Error");
  }
});

app.use("/user/user-service", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:5002/api${req.url}`, // port sesuai user-service
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Internal Server Error");
  }
});

app.use("/workspace/workspace-service", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:5000/api${req.url}`, // Ganti dengan URL workspace service
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Internal Server Error");
  }
});

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    // await db.sequelize.sync({ alter: true });
    // console.log("Database connected");

    // await workspaceEventConsumer.runWorkspaceConsumer();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

startServer();

// app.listen(PORT, () => {
//   console.log(`API Gateway running on port ${PORT}`);
//   console.log(`http://localhost:${PORT}/project/project-service`);
//   console.log(`http://localhost:${PORT}/user/user-service`);
//   console.log(`http://localhost:${PORT}/workspace/workspace-service`);
// });
