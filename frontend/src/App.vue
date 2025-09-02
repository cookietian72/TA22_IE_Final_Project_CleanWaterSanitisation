<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import BackToTop from "@/components/BackToTop.vue";
</script>

<template>
  <NavBar />
  <router-view />
  <BackToTop />
</template>

<style>
/* Global, light reset */
:root { color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif; color: #0f172a; background: #fff; }
</style>
