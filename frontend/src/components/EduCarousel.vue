<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

/** Shared type not required here to avoid SFC TS parse issues */

const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
  accent: { type: String, required: false }
});

const emit = defineEmits(["open"]);

/* --- responsive per-view --- */
const winW = ref(window.innerWidth);
const onResize = () => (winW.value = window.innerWidth);
onMounted(() => window.addEventListener("resize", onResize));
onUnmounted(() => window.removeEventListener("resize", onResize));

const perView = computed(() => (winW.value >= 1024 ? 3 : winW.value >= 720 ? 2 : 1));

const pages = computed(() => {
  const per = perView.value;
  const out = [];
  for (let i = 0; i < props.items.length; i += per) out.push(props.items.slice(i, i + per));
  return out;
});
const pageCount = computed(() => Math.max(1, pages.value.length));

/* --- carousel state --- */
const scroller = ref(null);
const current = ref(0);

const onScroll = () => {
  const el = scroller.value;
  if(!el) return;
  // @ts-ignore
  current.value = Math.round(el.scrollLeft / el.clientWidth);
};
watch(perView, () => requestAnimationFrame(() => scrollTo(current.value)));

function scrollTo(i) {
  const el = scroller.value;
  if(!el) return;
  const idx = Math.min(Math.max(0, i), pageCount.value - 1);
  // @ts-ignore
  el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  current.value = idx;
}
function prev() { scrollTo(current.value - 1); }
function next() { scrollTo(current.value + 1); }

/* --- pronunciation playback --- */
function playPron(item) {
  // If a real audio URL is provided, prefer that
  if (item.pronAudioUrl) {
    const audio = new Audio(item.pronAudioUrl);
    audio.play().catch(() => {});
    return;
  }
  // Fallback to Web Speech API (no network, works as placeholder)
  try{
    const rawTitle = String(item.title || "");
    const nameOnly = rawTitle.split(/[\s(]/)[0];
    const phrase = nameOnly;
    // @ts-ignore - speechSynthesis may not exist in all environments
    if (window.speechSynthesis && typeof window.SpeechSynthesisUtterance !== 'undefined') {
      // @ts-ignore
      const utter = new SpeechSynthesisUtterance(phrase);
      utter.rate = 0.95; utter.pitch = 1; utter.lang = 'en-US';
      // @ts-ignore
      window.speechSynthesis.cancel();
      // @ts-ignore
      window.speechSynthesis.speak(utter);
    }
  }catch{ /* no-op */ }
}
</script>

<template>
  <section class="block">
    <div class="header container">
      <h2 class="h2">{{ title }}</h2>
      <div class="hr"></div>
    </div>

    <div class="carousel container">
      <button class="ctrl left" :disabled="current===0" @click="prev" aria-label="Previous">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <button class="ctrl right" :disabled="current===pageCount-1" @click="next" aria-label="Next">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L12.17 12z"/></svg>
      </button>

      <div class="scroller" ref="scroller" @scroll.passive="onScroll">
        <div class="page" v-for="(group, i) in pages" :key="i">
          <div class="tiles" :style="{'--cols': perView}">
            <article
              v-for="tile in group"
              :key="tile.key"
              class="tile card"
              :class="[accent || tile.accent]"
              @click="emit('open', tile)"
            >
              <div class="tile__imgwrap">
                <img :src="tile.img" :alt="tile.title" />
              </div>
              <div class="tile__title">{{ tile.title }}</div>

              <!-- tiny hover reveal; click opens full-screen -->
              <div class="tile__panel">
                <div class="tile__pron">
                  <span>Pronounced: {{ tile.pron }}</span>
                  <button class="speak" @click.stop="playPron(tile)" aria-label="Play pronunciation">
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.25-3.9v7.8A4.5 4.5 0 0 0 16.5 12zm-2.25-8v2.06c3.45.5 6 3.46 6 6.94s-2.55 6.44-6 6.94V20c4-.52 7-3.92 7-8s-3-7.48-7-8z"/>
                    </svg>
                  </button>
                </div>
                <p>{{ tile.blurb }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>

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
.header .hr{ margin-top: 8px; }

.carousel{ position: relative; }
.scroller{
  margin-top: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  gap: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scroller::-webkit-scrollbar{ display:none; }
.page{ scroll-snap-align: start; padding: 2px; }

.tiles{ display:grid; grid-template-columns: repeat(var(--cols, 3), minmax(0,1fr)); gap:18px; }

.tile{ cursor: pointer; transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
       border-left-width:4px;border-left-style:solid; }
.tile:hover{ transform: translateY(-3px); box-shadow: 0 14px 40px rgba(2,132,199,.16); }

.tile.blue{ border-left-color:#0ea5e9; }
.tile.teal{ border-left-color:#14b8a6; }
.tile.orange{ border-left-color:#f59e0b; }

.tile__imgwrap{
  width:100%;
  aspect-ratio: 1/1; /* square box to avoid cropping across images */
  display:grid;place-items:center;
  border-radius:12px;
  background: linear-gradient(135deg, rgba(56,189,248,.2), rgba(20,184,166,.15));
  overflow:hidden;
}
.tile__imgwrap img{
  width:90%; height:90%;
  object-fit:contain; /* always show entire image */
}

.tile__title{ font-weight:800;margin:10px 2px 6px;color:#0b70b8; }

/* hover-only micro preview */
.tile__panel{ overflow:hidden; max-height:0; opacity:.0; transform: translateY(-4px);
  transition: max-height .28s ease, opacity .25s ease, transform .28s ease; color:#334; }
.tile__pron{ display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:.92rem;color:#64748b;margin-bottom:6px; }
.tile__pron .speak{
  border:1px solid var(--border); background:#fff; color:#0b70b8; cursor:pointer;
  display:inline-grid; place-items:center; border-radius:8px; padding:6px;
}
.tile__pron .speak:hover{ background:#e6f6ff; }
.tile:hover .tile__panel{ max-height:150px; opacity:1; transform: translateY(0); }

.ctrl{
  position:absolute;top:50%;transform:translateY(-50%);
  height:42px;width:42px;border-radius:999px;border:1px solid var(--border);
  background:#fff;color:#0b70b8;display:grid;place-items:center;cursor:pointer;
  box-shadow: 0 8px 24px rgba(2,132,199,.18);
}
.ctrl.left{ left:-6px; } .ctrl.right{ right:-6px; }
.ctrl:disabled{ opacity:.45; cursor:default; box-shadow:none; }

.dots{ display:flex;justify-content:center;gap:8px;margin-top:12px }
.dot{ width:10px;height:10px;border-radius:999px;border:1px solid #9ccdee;background:#fff; }
.dot.active{ background:#0ea5e9;border-color:#0ea5e9; }

@media (max-width:760px){ .ctrl.left{ left:6px; } .ctrl.right{ right:6px; } }
</style>
