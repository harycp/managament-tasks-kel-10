import { createWebHistory, createRouter } from "vue-router";
import Index from "../pages/Landing/Index.vue";
import Register from "../pages/Auth/Register.vue";
import Login from "../pages/Auth/Login.vue";
import IndexHome from "../pages/Home/Index.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Index,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: IndexHome,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware: Cek apakah user sudah login
router.beforeEach((to, from, next) => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    localStorage.setItem("authToken", token);
    window.history.replaceState({}, document.title, to.path);
  }

  const isAuthenticated = !!localStorage.getItem("authToken");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
