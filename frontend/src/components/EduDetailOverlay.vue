<script setup lang="ts">
import { onMounted, onUnmounted, computed } from "vue";
import type { EduItem } from "./EduCarousel.vue";

const props = defineProps<{
  item: EduItem | null;
  accent?: "blue" | "teal" | "orange";
}>();
const emit = defineEmits<{ (e:"close"): void }>();

// close on Esc
const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") emit("close"); };
onMounted(() => document.addEventListener("keydown", onKey));
onUnmounted(() => document.removeEventListener("keydown", onKey));

const theme = computed(() => props.accent || props.item?.accent || "blue");
</script>

<template>
  <!-- Scrim -->
  <transition name="fade">
    <div v-if="item" class="overlay" @click.self="emit('close')">
      <!-- Sliding sheet -->
      <transition name="sheet">
        <section v-if="item" class="sheet" :class="theme">
          <button class="back" @click="emit('close')" aria-label="Back">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M15.41 7.41 14 6 8 12l6 6 1.41-1.41L10.83 12z"/>
            </svg>
            Back
          </button>

          <div class="content">
            <div class="media">
              <img :src="item.img" :alt="item.title" />
            </div>

            <div class="info">
              <h2>{{ item.title }}</h2>
              <p class="pron">Pronounced: {{ item.pron }}</p>
              <p class="blurb">{{ item.blurb }}</p>
            </div>
          </div>
        </section>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* full-screen */
.overlay{
  position: fixed; inset: 0; background: rgba(2, 6, 23, 0.55);
  display: grid; place-items: end center; z-index: 50;
}

/* slide-up "sheet" that fills screen */
.sheet{
  width: 100%; height: 100%;
  background: #ffffff;
  border-top-left-radius: 0; border-top-right-radius: 0;
  box-shadow: 0 -30px 80px rgba(0,0,0,.25);
  display: grid; grid-template-rows: auto 1fr; padding: 16px;
}
/* accent top border */
.sheet.blue   { border-top: 6px solid #0ea5e9; }
.sheet.teal   { border-top: 6px solid #14b8a6; }
.sheet.orange { border-top: 6px solid #f59e0b; }

.back{
  appearance: none; border:1px solid #dbeafe; border-radius: 12px;
  background:#fff; color:#0b70b8; padding:8px 12px; display:inline-flex; gap:8px; align-items:center;
  font-weight:600; cursor:pointer;
}
.back:hover{ background:#f0f9ff; }

.content{
  display:grid; grid-template-columns: 1fr 1fr; gap: 28px; padding: 12px 6px 6px;
  height: 100%;
}

/* "floating" image animation (gentle up/down) */
.media{ display:grid; place-items:center; }
.media img{
  max-width: 90%; max-height: 70vh; object-fit: contain;
  animation: float 4.5s ease-in-out infinite;
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-10px); }
}

.info{ align-self:center; }
.info h2{ margin:0 0 6px; font-size: clamp(1.6rem, 1.1rem + 1.5vw, 2.2rem); color:#0b4268; }
.pron{ color:#64748b; margin:.25rem 0 .75rem; }
.blurb{ font-size:1.05rem; line-height:1.65; }

/* transitions */
.fade-enter-active, .fade-leave-active{ transition: opacity .25s ease; }
.fade-enter-from,  .fade-leave-to{ opacity: 0; }

.sheet-enter-active, .sheet-leave-active{ transition: transform .32s ease, opacity .32s ease; }
.sheet-enter-from,  .sheet-leave-to{ transform: translateY(100%); opacity: 0; }

/* responsive */
@media (max-width: 980px){
  .content{ grid-template-columns: 1fr; }
  .media img{ max-height: 48vh; }
}
</style>
