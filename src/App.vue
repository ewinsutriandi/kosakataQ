<template>
  <div id="app" class="app-shell">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <header class="main-header mb-6">
          <h1>kosakataQ</h1>
          <p class="subtitle">Bermain dan belajar arti kata ayat-ayat al Qur'an</p>
        </header>
        
        <div class="spinner"></div>
        <h2>{{ loadingMessage }}</h2>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <p>{{ loadingProgress }}%</p>
      </div>
    </div>
    
    <template v-else>
      <navigation-overlay v-if="!$route.meta.hideNavigation" :is-open="isNavOpen" @close="isNavOpen = false" />

      <main class="app-content">
        <transition name="fade" mode="out-in">
          <router-view :key="$route.fullPath" />
        </transition>
      </main>

      <floating-dock v-if="!$route.meta.hideNavigation" @toggle-menu="isNavOpen = !isNavOpen" />
    </template>
  </div>
</template>

<style>
/* Global Toast Overrides - White with Accents */
body .v-toast__item {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  border-radius: 12px !important; /* Slightly sharper for card look */
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
  padding: 12px 24px !important;
  font-weight: 700 !important;
  min-height: auto !important;
  border: 1px solid rgba(0,0,0,0.05) !important;
  border-left: 6px solid var(--text-secondary) !important; /* Default accent */
  opacity: 1 !important;
  background-color: #FFFFFF !important; 
  color: var(--text-primary) !important;
}

body .v-toast__item .v-toast__text {
  font-size: 1.1rem !important;
  padding: 0 !important;
  color: var(--text-primary) !important;
}

/* Success Toast - Sage Accent */
body .v-toast__item--success,
body .v-toast--success .v-toast__item {
  border-left: 6px solid #8DA189 !important; /* Sage */
}

/* Error Toast - Red Accent */
body .v-toast__item--error,
body .v-toast--error .v-toast__item {
  border-left: 6px solid #EF4444 !important; /* Red */
}

body .v-toast__icon {
  display: none !important;
}

/* Loading Overlay Styles */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  flex-direction: column;
}

.loading-content {
  text-align: center;
  width: 300px;
}

/* Header Styles in Loading Screen */
.loading-content .main-header {
  margin-bottom: 2rem;
}

.loading-content .main-header h1 {
  font-size: 1.5rem;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.loading-content .subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 5px;
}

.loading-content h2 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid var(--text-secondary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin: 15px 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--text-secondary);
  transition: width 0.3s ease;
}
</style>

<script>
import NavigationOverlay from "@/components/NavigationOverlay.vue";
import FloatingDock from "@/components/FloatingDock.vue";
import { mapState } from "vuex";

export default {
  components: { NavigationOverlay, FloatingDock },
  data() {
    return {
      isNavOpen: false,
    };
  },
  computed: {
    ...mapState(["isLoading", "loadingProgress", "loadingMessage"]),
  },
  beforeMount() {
    this.$store.commit("initializeVars");
    this.$store.dispatch("initData");
  },
};
</script>

<style>
/* Global Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#app {
  min-height: 100vh;
  color: var(--color-text);
  font-family: var(--font-family-base);
  position: relative;
  overflow-x: hidden;
  background-color: var(--color-bg);
}

.app-shell {
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
  width: 100%;
  padding-top: var(--spacing-lg);
  padding-bottom: 120px; /* Space for floating dock */
  position: relative;
  z-index: 10;
  max-width: 800px; /* Centered like reference */
  margin: 0 auto;
}
</style>
