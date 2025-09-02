import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home.vue";
import HeatMap from "@/pages/HeatMap.vue";
import ToiletMap from "@/pages/ToiletMap.vue";
import EduPage from "@/pages/EduPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/heatmap", name: "heatmap", component: HeatMap },
    { path: "/toilet-map", name: "toilet-map", component: ToiletMap },
    { path: "/edu", name: "edu", component: EduPage },
    { path: "/:pathMatch(.*)*", redirect: "/" }
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    return { top: 0 };
  }
});

export default router;
