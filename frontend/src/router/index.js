import { createWebHistory, createRouter } from "vue-router";
import { checkAuth, verifyResetToken } from "../utils/auth";

import Index from "../pages/Landing/Index.vue";
import Register from "../pages/Auth/Register.vue";
import Login from "../pages/Auth/Login.vue";
import Home from "../pages/Home/Index.vue";
import Dashboard from "../pages/Dashboard/Index.vue";
import RegisterEmail from "../pages/Auth/RegisterEmail.vue";
import ResetPassword from "../pages/Auth/ResetPassword.vue";
import RequestResetPassword from "../pages/Auth/RequestResetPassword.vue";
import Boards from "../pages/Boards/Boards.vue";

const routes = [
  { path: "/", name: "landing", component: Index },
  { path: "/register", name: "register", component: RegisterEmail },
  {
    path: "/verify-email",
    name: "verify-email",
    component: Register,
    meta: { requiresToken: true },
  },
  { path: "/login", name: "login", component: Login },
  {
    path: "/request-reset-password",
    name: "request-reset-password",
    component: RequestResetPassword,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
    meta: { requiresToken: true }, // Tambah meta untuk pengecekan token
  },
  {
    path: "/h",
    name: "home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/b",
    name: "boards",
    component: Boards,
    meta: { requiresAuth: true },
  },
  {
    path: "/d",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await checkAuth();

  const publicOnlyPaths = ["/", "/login", "/register", "/verify-email"];

  if (isAuthenticated && publicOnlyPaths.includes(to.path)) {
    return next("/h");
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  if (to.meta.requiresToken) {
    const token = to.query.token;
    if (token) {
      const isValid = await verifyResetToken(token);
      return isValid ? next() : next("/login");
    } else {
      return next("/login");
    }
  }

  next();
});

export default router;
