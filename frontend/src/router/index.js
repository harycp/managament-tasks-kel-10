import { createWebHistory, createRouter } from "vue-router";
import { checkAuth } from "../utils/auth";

import Index from "../pages/Landing/Index.vue";
import Register from "../pages/Auth/Register.vue";
import Login from "../pages/Auth/Login.vue";
import IndexHome from "../pages/Home/Index.vue";

const routes = [
  { path: "/", name: "home", component: Index },
  { path: "/register", name: "register", component: Register },
  { path: "/login", name: "login", component: Login },
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

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth();
    isAuthenticated ? next() : next("/login");
  } else {
    next();
  }
});

export default router;
