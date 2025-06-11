const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const notificationService = require("../services/notification-service/src/server.js");
const projectService = require("../../services/project-service/src/server.js");
const userService = require("../../services/user-service/src/server.js");
const taskService = require("../../services/task-service/src/server.js");
const workspaceService = require("../../services/workspace-service/src/server.js");

// Variabel environment dari file .env
dotenv.config();

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173", // Ganti sesuai origin frontend
        credentials: true, // Wajib agar cookie bisa dikirim
    })
)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/notification/notification-service", notificationService);
app.use("/project/project-service", projectService);
app.use("/user/user-service", userService);
app.use("/task/task-service", taskService);
app.use("/workspace/workspace-service", workspaceService);

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Database connected");

    await workspaceEventConsumer.runWorkspaceConsumer();
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
//   console.log(`http://localhost:${PORT}/task/task-service`);
//   console.log(`http://localhost:${PORT}/workspace/workspace-service`);
// });
