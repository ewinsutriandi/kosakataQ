<template>
  <div id="app" class="app-shell">
    <navigation-overlay v-if="!$route.meta.hideNavigation" :is-open="isNavOpen" @close="isNavOpen = false" />

    <main class="app-content">
      <transition name="fade" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </main>

    <floating-dock v-if="!$route.meta.hideNavigation" @toggle-menu="isNavOpen = !isNavOpen" />
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
</style>

<script>
import NavigationOverlay from "@/components/NavigationOverlay.vue";
import FloatingDock from "@/components/FloatingDock.vue";

export default {
  components: { NavigationOverlay, FloatingDock },
  data() {
    return {
      isNavOpen: false,
    };
  },
  beforeMount() {
    this.$store.commit("initializeVars");
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
