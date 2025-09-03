<script setup lang="ts">
/* Background image used for the Title + STAT DATA sections */
import bgImg from "@/assets/edu/hero-stat-bg.jpg";

const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

/* Bind as CSS variable so we can reuse it on multiple sections */
const bgStyle = { "--bg-url": `url(${bgImg})` } as Record<string, string>;
</script>

<template>
  <main>
    <!-- Title + Short Brief (Hero) with image on left, content on right -->
    <section class="section hero-section">
      <div class="container hero">
        <div class="hero__image" :style="bgStyle" aria-hidden="true"></div>
        <div class="hero__text hero__panel">
          <h1 class="h1">Safe Water & Sanitation Insights</h1>
          <p class="lead">
            A modern, responsive dashboard to explore water quality, sanitation access, and learning
            resources – combining an offline dataset with two real-time APIs.
          </p>
          <div class="hero__cta">
            <router-link to="/heatmap" class="btn">Open Heat Map</router-link>
            <router-link to="/toilet-map" class="btn" style="border-color:#d6f4ef;color:#0f766e">
              Toilet Map
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- STAT DATA (no background image) -->
    <section id="stats" class="section">
      <div class="container">
        <h2 class="h2">STAT DATA</h2>

        <div class="grid stats">
          <article class="card stat">
            <span class="label">Total Water Sources</span>
            <span class="value">—</span>
            <small>from DB (offline CSV)</small>
          </article>

          <article class="card stat">
            <span class="label">Avg. pH (24h)</span>
            <span class="value">—</span>
            <small>real-time API A</small>
          </article>

          <article class="card stat">
            <span class="label">Turbidity Alerts</span>
            <span class="value">—</span>
            <small>real-time API B</small>
          </article>
        </div>
      </div>
    </section>

    <!-- Articles / Problems (unchanged) -->
    <section class="section">
      <div class="container">
        <h2 class="h2">Articles / Problems</h2>

        <div class="grid articles">
          <article class="card article">
            <h3>Contamination hotspots</h3>
            <p>Identify and prioritize remediation zones using combined datasets.</p>
          </article>
          <article class="card article">
            <h3>Toilet access gaps</h3>
            <p>Track coverage, maintenance status and accessibility.</p>
          </article>
          <article class="card article">
            <h3>Education & safety</h3>
            <p>Community tips: safe storage, chlorine dosing, hand-washing.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer__row">
        <strong>Fantastic Six</strong>
        <button class="btn" @click="toTop" aria-label="Move to top">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4l-7 7h4v9h6v-9h4z" fill="currentColor" />
          </svg>
          Move to top
        </button>
      </div>
    </footer>
  </main>
</template>

<style scoped>
/* ===== Hero layout (image left, content right) ===== */
.hero{display:grid;grid-template-columns:1.1fr 1fr;gap:20px;align-items:center}
.hero__image{width:100%;aspect-ratio:16/10;background-image:var(--bg-url);background-size:cover;background-repeat:no-repeat;background-position:center center;background-color:#f6faf9;border-radius:10px}
.hero__text{padding:18px}
.hero__panel{background:rgba(255,255,255,0.88);backdrop-filter:saturate(120%) blur(2px);border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,0.08)}
.hero__cta{display:flex;gap:12px;margin-top:14px}

/* ===== Grids ===== */
.stats{grid-template-columns:repeat(3, minmax(0,1fr))}
.stat{display:grid;gap:6px}
.stat .label{font-weight:700}
.stat .value{font-size:28px;color:var(--primary-900)}

.articles{grid-template-columns:repeat(3, minmax(0,1fr))}
.article h3{margin:0 0 6px}

/* ===== Footer ===== */
.footer{border-top:2px solid var(--teal);padding:18px 0 40px;background:#fff}
.footer__row{display:flex;align-items:center;justify-content:space-between}

@media (max-width: 980px){
  .articles, .stats{grid-template-columns:1fr}
  .hero{grid-template-columns:1fr;gap:14px}
  .hero__image{aspect-ratio:16/12;background-size:cover;background-position:center center}
}
</style>
