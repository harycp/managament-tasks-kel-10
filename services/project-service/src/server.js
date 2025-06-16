const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const db = require("./models");
const cookieParser = require("cookie-parser");

const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");
const taskRoutes = require("./routes/taskRoutes");

const workspaceEventConsumer = require("./kafka/consumers/workspaceEventConsumer");

// Worker
// require("./workers/boardEventWorker");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "https://localhost",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", boardRoutes);
app.use("/api", listRoutes);
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 5003;

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
