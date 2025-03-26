import { createWebHistory, createRouter } from "vue-router";
import Index from "../pages/Landing/Index.vue";
import Register from "../pages/Auth/Register.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
