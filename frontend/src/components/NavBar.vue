<script setup lang="ts">

import { ref } from "vue";
import { useRoute } from "vue-router";

/* Put your image as src/assets/logo.png (PNG/WebP/SVG). */
import logoUrl from "@/assets/logo.png";

const route = useRoute();
const open = ref(false);
const toggle = () => (open.value = !open.value);
const close = () => (open.value = false);
</script>

<template>
  <header class="wb-nav">
    <div class="container wb-nav-inner">
      <!-- Logo block -->
      <router-link to="/" class="wb-item wb-logo" @click="close" aria-label="Home">
        <img :src="logoUrl" alt="Dromana Beach Water Quality logo" class="logo-img" />
        <span class="brand-text">CleanWater</span>
      </router-link>

      <!-- Mobile menu button -->
      <button class="hamburger" @click="toggle" aria-label="Toggle menu">
        <span/><span/><span/>
      </button>

      <!-- Links with vertical separators (desktop) / collapsible (mobile) -->
      <nav class="wb-links" :class="{ open }" @click="close">
        <router-link :class="['wb-item', {active: route.name==='home'}]" to="/">Home</router-link>
        <router-link :class="['wb-item', {active: route.name==='heatmap'}]" to="/heatmap">Heat Map</router-link>
        <router-link :class="['wb-item', {active: route.name==='toilet-map'}]" to="/toilet-map">Toilet Map</router-link>
        <router-link :class="['wb-item', {active: route.name==='edu'}]" to="/edu">Edu Page</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.wb-nav{
  position:sticky;top:0;z-index:50;background:#ffffffcc;backdrop-filter:blur(6px);
  border-bottom:2px solid var(--teal);
}
.wb-nav-inner{
  display:flex;align-items:center;gap:0;padding:10px 0;
}

/* Logo cell (no left divider) */
.wb-logo{
  display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--primary-900);
  padding:8px 14px;border-left:none !important;font-weight:800;
}
.logo-img{width:28px;height:28px;object-fit:contain}
.brand-text{display:none;color:var(--primary-900)}
@media (min-width:520px){ .brand-text{display:inline} }

/* Vertical separators for items (desktop style from your sketch) */
.wb-item{
  color:#1f2937;text-decoration:none;padding:8px 14px;border-left:2px solid var(--teal);
  transition:background .15s;
}
.wb-item:hover{background:#f1fbf8}
.wb-item.active{background:#e8f6ff;color:#0b70b8}

/* Desktop links row */
.wb-links{margin-left:auto;display:flex;gap:0}

/* Mobile */
.hamburger{
  margin-left:auto;border:1px solid var(--border);background:#fff;border-radius:10px;padding:8px;display:none;
}
.hamburger span{display:block;width:18px;height:2px;background:#0b70b8;margin:3px 0}
@media (max-width: 860px){
  .hamburger{display:block}
  .wb-links{
    position:absolute;left:0;right:0;top:58px;background:#fff;border-bottom:1px solid var(--border);
    display:grid;gap:0;padding:8px 20px;transform:scaleY(0);transform-origin:top;transition:200ms;
  }
  .wb-links.open{transform:scaleY(1)}
  .wb-item{border-left:none;border-top:1px solid var(--teal)}
  .wb-item:first-child{border-top:none}
}
</style>
