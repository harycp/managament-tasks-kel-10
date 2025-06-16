const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const cookieParser = require("cookie-parser");

const workspaceRoutes = require("./routes/workspaceRoutes");
const workspaceMemberRoutes = require("./routes/workspaceMemberRoutes");
const db = require("./models");

// const userEventConsumer = require("./kafka/consumers/userEventConsumer");
// const boardEventConsumer = require("./kafka/consumers/boardEventConsumer");

const { runMainConsumer } = require("./kafka/consumers/mainConsumer");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", workspaceRoutes);
app.use("/api", workspaceMemberRoutes);

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Database connected");

    runMainConsumer().catch((error) => {
      console.error("FATAL: Kafka consumer failed to start.", error);
      process.exit(1);
    });

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

startServer();
