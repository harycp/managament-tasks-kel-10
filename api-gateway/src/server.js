const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const port = 5000;

app.use(
  "/user-service",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  })
);

app.use(
  "/workspace-service",
  createProxyMiddleware({
    target: "http://localhost:5002",
    changeOrigin: true,
  })
);

app.use(
  "/project-service",
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,
  })
);

app.listen(port, () => {
  console.log(`API Gateway berjalan pada port ${port}`);
});
