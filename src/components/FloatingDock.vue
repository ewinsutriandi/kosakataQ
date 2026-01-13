<template>
  <nav class="bottom-nav">
    <router-link to="/picksurah/j30" class="nav-item" active-class="active">
      <span class="icon">🏠</span>
      <span class="label">Home</span>
    </router-link>

    <router-link to="/picksurah/all" class="nav-item" active-class="active">
      <span class="icon">📖</span>
      <span class="label">Read</span>
    </router-link>

    <router-link to="/stats/j30" class="nav-item" active-class="active">
      <span class="icon">📈</span>
      <span class="label">Stats</span>
    </router-link>

    <button class="nav-item" @click="$emit('toggle-menu')">
      <span class="icon">🌿</span>
      <span class="label">More</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 400px;
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-amount));
  border: 1px solid var(--surface-glass-border);
  border-radius: 40px;
  display: flex;
  justify-content: space-around;
  padding: 12px 10px;
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-secondary);
  gap: 4px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-item.active {
  color: var(--sage);
  transform: translateY(-2px);
}

.nav-item .icon {
  font-size: 1.2rem;
}

.nav-item .label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>

<script>
export default {
  name: "FloatingDock",
};
</script>
