<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const show = ref(false);
const onScroll = () => (show.value = window.scrollY > 300);
const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <button
    v-show="show"
    class="to-top"
    @click="toTop"
    aria-label="Move to top"
    title="Move to top"
  >
    <!-- Up arrow -->
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M12 4l-7 7h4v9h6v-9h4z" fill="currentColor" />
    </svg>
  </button>
</template>

<style scoped>
.to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  height: 44px;
  width: 44px;
  border-radius: 999px;
  border: 1px solid #d9e2f3;
  background: white;
  color: #0a5dc2;
  box-shadow: 0 6px 16px rgba(10, 93, 194, .18);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.to-top:hover { transform: translateY(-2px); }
</style>
