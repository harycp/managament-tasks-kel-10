const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const rolePermissionRoutes = require("./routes/rolePermissionRoutes");
const userRoleAssignmentRoutes = require("./routes/userRoleAssignmentRoutes");
const userRoleRoutes = require("./routes/userRoleRoutes");
const emailConsumer = require("./kafka/consumers/emailConsumer");
const db = require("./models");


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
app.use("/api", permissionRoutes);
app.use("/api", rolePermissionRoutes);
app.use("/api", userRoleAssignmentRoutes);
app.use("/api", userRoleRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Database connected");

    await emailConsumer.runEmailConsumer();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

startServer();
