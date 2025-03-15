import { createMemoryHistory, createRouter } from "vue-router";
import Index from "../pages/Landing/Index.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Index,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
