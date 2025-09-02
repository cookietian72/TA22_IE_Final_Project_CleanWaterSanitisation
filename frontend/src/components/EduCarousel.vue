<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

/** Types shared with the page */
export type EduItem = {
  key: string;
  title: string;
  pron: string;
  blurb: string;
  img: string;
  accent?: "blue" | "teal" | "orange";
};

const props = defineProps<{
  title: string;
  items: EduItem[];
  /** section accent color */
  accent?: "blue" | "teal" | "orange";
}>();

/* --- responsive per-view --- */
const winW = ref(window.innerWidth);
const onResize = () => (winW.value = window.innerWidth);
onMounted(() => window.addEventListener("resize", onResize));
onUnmounted(() => window.removeEventListener("resize", onResize));

/** 3 on desktop, 2 on tablet, 1 on mobile */
const perView = computed(() => (winW.value >= 1024 ? 3 : winW.value >= 720 ? 2 : 1));

/** chunk items into pages based on perView */
const pages = computed(() => {
  const per = perView.value;
  const out: EduItem[][] = [];
  for (let i = 0; i < props.items.length; i += per) out.push(props.items.slice(i, i + per));
  return out;
});
const pageCount = computed(() => Math.max(1, pages.value.length));

/* --- carousel state --- */
const scroller = ref<HTMLDivElement | null>(null);
const current = ref(0);

/** keep track when user scrolls manually */
const onScroll = () => {
  const el = scroller.value!;
  current.value = Math.round(el.scrollLeft / el.clientWidth);
};

/** when perView changes (resize), snap back to a valid page */
watch(perView, () => requestAnimationFrame(() => scrollTo(current.value)));

function scrollTo(i: number) {
  const el = scroller.value!;
  const idx = Math.min(Math.max(0, i), pageCount.value - 1);
  el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  current.value = idx;
}
function prev() { scrollTo(current.value - 1); }
function next() { scrollTo(current.value + 1); }

/* --- open/close panels per tile without mutating props --- */
const openKeys = ref<Set<string>>(new Set());
function toggle(key: string) {
  if (openKeys.value.has(key)) openKeys.value.delete(key);
  else openKeys.value.add(key);
}
function isOpen(key: string) {
  return openKeys.value.has(key);
}
</script>

<template>
  <section class="block">
    <div class="header container">
      <h2 class="h2">{{ title }}</h2>
      <div class="hr"></div>
    </div>

    <div class="carousel container">
      <!-- arrows -->
      <button class="ctrl left" :disabled="current===0" @click="prev" aria-label="Previous">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <button class="ctrl right" :disabled="current===pageCount-1" @click="next" aria-label="Next">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L12.17 12z"/>
        </svg>
      </button>

      <!-- pages -->
      <div class="scroller" ref="scroller" @scroll.passive="onScroll">
        <div class="page" v-for="(group, i) in pages" :key="i">
          <div class="tiles" :style="{'--cols': perView}">
            <article
              v-for="tile in group"
              :key="tile.key"
              class="tile card"
              :class="[accent || tile.accent, { open: isOpen(tile.key) }]"
              @click="toggle(tile.key)"
            >
              <div class="tile__imgwrap">
                <img :src="tile.img" :alt="tile.title" />
              </div>
              <div class="tile__title">{{ tile.title }}</div>
              <div class="tile__panel">
                <div class="tile__pron">Pronounced: {{ tile.pron }}</div>
                <p>{{ tile.blurb }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>

      <!-- dots -->
      <div class="dots" role="tablist" aria-label="carousel pagination">
        <button
          v-for="(_, i) in pageCount"
          :key="i"
          class="dot"
          :class="{ active: i===current }"
          @click="scrollTo(i)"
          :aria-label="`Go to page ${i+1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.block{ margin: 14px 0 30px; }

/* header */
.header .hr{ margin-top: 8px; }

/* carousel frame */
.carousel{ position: relative; }
.scroller{
  margin-top: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  gap: 0;
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none;    /* Firefox */
}
.scroller::-webkit-scrollbar{ display:none; }
.page{
  scroll-snap-align: start;
  padding: 2px; /* breathing room at edges */
}

/* tiles grid within each page */
.tiles{
  display:grid;
  grid-template-columns: repeat(var(--cols, 3), minmax(0,1fr));
  gap:18px;
}

/* card/tile styles (consistent with page) */
.tile{
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  border-left-width:4px;border-left-style:solid;
}
.tile:hover{ transform: translateY(-3px); box-shadow: 0 14px 40px rgba(2,132,199,.16); }

.tile.blue{ border-left-color:#0ea5e9; }
.tile.teal{ border-left-color:#14b8a6; }
.tile.orange{ border-left-color:#f59e0b; }

.tile__imgwrap{
  width:100%;
  aspect-ratio: 16/11;
  display:grid;place-items:center;
  border-radius:12px;
  background: linear-gradient(135deg, rgba(56,189,248,.2), rgba(20,184,166,.15));
  overflow:hidden;
}
.tile__imgwrap img{ max-width:88%; max-height:88%; object-fit:contain; }

.tile__title{
  font-weight:800;margin:10px 2px 6px;color:#0b70b8;
}

.tile__panel{
  overflow:hidden;max-height:0;opacity:.0;transform: translateY(-4px);
  transition: max-height .28s ease, opacity .25s ease, transform .28s ease;
  color:#334;
}
.tile__pron{ font-size:.92rem;color:#64748b;margin-bottom:6px; }
.tile.open .tile__panel{ max-height:220px;opacity:1;transform: translateY(0); }

/* arrow buttons */
.ctrl{
  position:absolute;top:50%;transform:translateY(-50%);
  height:42px;width:42px;border-radius:999px;border:1px solid var(--border);
  background:#fff;color:#0b70b8;display:grid;place-items:center;cursor:pointer;
  box-shadow: 0 8px 24px rgba(2,132,199,.18);
}
.ctrl.left{ left:-6px; }
.ctrl.right{ right:-6px; }
.ctrl:disabled{ opacity:.45; cursor:default; box-shadow:none; }

/* dots */
.dots{ display:flex;justify-content:center;gap:8px;margin-top:12px }
.dot{
  width:10px;height:10px;border-radius:999px;border:1px solid #9ccdee;background:#fff;
}
.dot.active{ background:#0ea5e9;border-color:#0ea5e9; }

@media (max-width:760px){
  .ctrl.left{ left:6px; }
  .ctrl.right{ right:6px; }
}
</style>
