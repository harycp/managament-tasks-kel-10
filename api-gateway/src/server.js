const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const port = 5000;
const dotenv = require("dotenv");

dotenv.config();

const user_service = process.env.USER_SERVICE_URL;
const workspace_service = process.env.WORKSPACE_SERVICE_URL;
const project_service = process.env.PROJECT_SERVICE_URL;

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "https://localhost",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// Log setiap request yang masuk
app.use((req, res, next) => {
  console.log(`[Gateway] Proxying request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  "/user-service",
  createProxyMiddleware({
    target: user_service || "http://localhost:5001",
    changeOrigin: true,
    pathRewrite: {
      "^/user-service": "",
    },
  })
);

app.use(
  "/workspace-service",
  createProxyMiddleware({
    target: workspace_service || "http://localhost:5002",
    changeOrigin: true,
    pathRewrite: {
      "^/workspace-service": "",
    },
  })
);

app.use(
  "/project-service",
  createProxyMiddleware({
    target: project_service || "http://localhost:5003",
    changeOrigin: true,
    pathRewrite: {
      "^/project-service": "",
    },
  })
);

app.listen(port, () => {
  console.log(`API Gateway berjalan pada port ${port}`);
});
