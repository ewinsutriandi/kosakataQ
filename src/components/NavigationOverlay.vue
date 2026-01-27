<template>
  <div class="side-drawer" :class="{ 'is-open': isOpen }">
    <div class="drawer-backdrop" @click="$emit('close')"></div>
    <div class="drawer-content">
      <button class="close-btn" @click="$emit('close')" aria-label="Close Menu">
        ✕
      </button>

      <div class="drawer-links">
        <div class="primary-links">
          <router-link
            to="/picksurah/j30"
            @click.native="$emit('close')"
            class="drawer-link primary"
            active-class="active"
          >
            Daftar surat
          </router-link>
          <router-link
            to="/word-frequency"
            @click.native="$emit('close')"
            class="drawer-link primary"
            active-class="active"
          >
            Daftar kata
          </router-link>
          <router-link
            to="/stats/j30"
            @click.native="$emit('close')"
            class="drawer-link primary"
            active-class="active"
          >
            Statistik bermain
          </router-link>
        </div>
        
        <div class="divider"></div>

        <router-link
          to="/playing-guide"
          @click.native="$emit('close')"
          class="drawer-link"
          >Cara Bermain</router-link
        >
        <router-link
          to="/credits"
          @click.native="$emit('close')"
          class="drawer-link"
          >Credits</router-link
        >
        <router-link
          to="/license"
          @click.native="$emit('close')"
          class="drawer-link"
          >License</router-link
        >
      </div>

      <div class="drawer-footer">
        <p class="brand">kosakataQ</p>
        <p class="copyright">version 2.0</p>
        <br>
        <p class="credits">by <a href="https://play.google.com/store/apps/developer?id=Alza+Interactive" target="_blank">Alza Interactive</a></p>
        <p class="credits">source code <a href="https://github.com/ewinsutriandi/kosakataQ" target="_blank">github</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationOverlay",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.side-drawer {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: none;
}

.side-drawer.is-open {
  pointer-events: auto;
}

.drawer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(60, 64, 48, 0.4);
  backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.side-drawer.is-open .drawer-backdrop {
  opacity: 1;
}

.drawer-content {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 280px;
  background: var(--bg);
  padding: 40px 30px;
  border-radius: 0 40px 40px 0;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.side-drawer.is-open .drawer-content {
  transform: translateX(0);
}

.close-btn {
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: 40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.drawer-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.drawer-link {
  font-size: 1.1rem;
  font-family: var(--font-family-base);
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-link.primary {
  font-size: 1.3rem;
  font-weight: 700;
  padding: 8px 0;
}

.drawer-link.active {
  color: var(--sage);
}

.icon {
  font-size: 1.4rem;
}

.divider {
  height: 1px;
  background-color: rgba(0,0,0,0.05);
  margin: 10px 0;
}

.drawer-link:hover {
  color: var(--sage);
}

.drawer-footer {
  margin-top: auto;
  color: var(--text-secondary);
}

.brand {
  font-weight: 700;
  margin-bottom: 4px;
}

.copyright {
  font-size: 0.8rem;
}

.credits {
  font-size: 0.6rem;
}
</style>
