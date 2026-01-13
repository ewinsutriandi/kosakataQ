<template>
  <header class="app-header">
    <div class="container header-content">
      <router-link to="/" class="brand-link">
        <span class="brand-text"
          >kosakata<span class="brand-highlight">Q</span></span
        >
      </router-link>

      <button
        class="menu-trigger"
        @click="$emit('toggle-menu')"
        aria-label="Open Menu"
      >
        <span class="menu-label">Menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  padding: var(--spacing-md) 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-link {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.brand-text {
  letter-spacing: -0.03em;
}

.brand-highlight {
  color: var(--color-primary);
}

.menu-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 2rem;
  transition: background-color 0.2s;
}

.menu-trigger:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.menu-label {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.w-6 {
  width: 1.5rem;
}
.h-6 {
  height: 1.5rem;
}
</style>
<script>
export default {
  name: "MinimalHeader",
};
</script>
