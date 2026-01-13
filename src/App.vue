<template>
  <div id="app" class="app-shell">
    <navigation-overlay :is-open="isNavOpen" @close="isNavOpen = false" />

    <main class="app-content">
      <transition name="fade" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </main>

    <floating-dock @toggle-menu="isNavOpen = !isNavOpen" />
  </div>
</template>

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
