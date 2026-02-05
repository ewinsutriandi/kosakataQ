<template>
  <div class="home-view">
    <header class="home-header">
      <img src="/logo.png" alt="kosakataQ Logo" class="home-logo" />
      <h1>kosakataQ</h1>
      <p class="subtitle">Bermain dan belajar arti kata ayat-ayat al Qur'an</p>
      <p class="version">version 2.0</p>
    </header>

    <div class="mode-cards">
      <router-link to="/picksurah/j30" class="mode-card">
        <h2 class="card-title">Mode Surat</h2>
        <p class="card-description">Belajar arti kata pada tiap surat</p>
      </router-link>

      <!--
      <router-link to="/word-frequency" class="mode-card">
        <h2 class="card-title">Kemunculan kata</h2>
        <p class="card-description">Belajar arti kata bertahap berdasarkan kemunculan</p>
      </router-link>
      -->

      <router-link to="/levels" class="mode-card">
        <h2 class="card-title">Mode Level</h2>
        <p class="card-description">Belajar bertahap 50 kata per level</p>
      </router-link>
    </div>

    <div class="secondary-links">
      <router-link to="/stats/j30" class="secondary-link">Statistik</router-link>
      <router-link to="/playing-guide" class="secondary-link">Petunjuk</router-link>
      <router-link to="/credits" class="secondary-link">Credits</router-link>
      <router-link to="/license" class="secondary-link">License</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.home-view {
  width: 100%;
  min-height: calc(100vh - 120px); /* Adjusting for app shell top/bottom offsets */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
}
.home-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.home-logo {
  width: 100px;
  height: 100px;
  margin: 0 auto var(--spacing-md) auto;
  display: block;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.home-header h1 {
  font-size: 2rem;
  letter-spacing: 2px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 500px;
  margin: 0 auto;
}

.version {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-top: 8px;
  opacity: 0.6;
}

.mode-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  width: 100%;
  margin-bottom: var(--spacing-xl);
}

@media (min-width: 600px) {
  .mode-cards {
    grid-template-columns: 1fr 1fr;
  }
}

.mode-card {
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-amount));
  border: 1px solid var(--surface-glass-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.mode-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--coffee);
}

.mode-card:active {
  transform: translateY(-2px);
}


.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.card-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.secondary-links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.secondary-link {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.secondary-link:hover {
  color: var(--coffee);
  background: rgba(109, 76, 65, 0.1);
}

@media (max-width: 600px) {
  .home-header h1 {
    font-size: 1.6rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
}
</style>
