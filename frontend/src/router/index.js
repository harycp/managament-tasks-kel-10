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
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
