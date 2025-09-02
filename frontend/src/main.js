import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css"; // keep Vite’s default or your own styles

createApp(App).use(createPinia()).use(router).mount("#app");
