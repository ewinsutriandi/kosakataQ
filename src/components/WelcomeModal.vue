<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title">Selamat Datang di kosakataQ</h2>
        <p class="modal-subtitle">Belajar kosakata Al-Qur'an jadi lebih mudah.</p>
      </div>

      <div class="modal-body">
        <div class="feature-item">
          <div class="feature-icon">📖</div>
          <div class="feature-text">
            <h3>Kosakata surat</h3>
            <p>Bermain dan belajar arti kata yang muncul pada surat tertentu.</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">📊</div>
          <div class="feature-text">
            <h3>Kemunculan kata</h3>
            <p>Bermain dan belajar arti kata berdasarkan seberapa sering kata itu muncul.</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-start" @click="closeModal">Mulai Belajar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WelcomeModal",
  data() {
    return {
      isOpen: false,
    };
  },
  mounted() {
    const seen = localStorage.getItem("kosakataq_intro_seen");
    if (!seen) {
      // Small delay for better UX on entry
      setTimeout(() => {
        this.isOpen = true;
      }, 500);
    }
  },
  methods: {
    closeModal() {
      this.isOpen = false;
      localStorage.setItem("kosakataq_intro_seen", "true");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(60, 64, 48, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  background: var(--card-white);
  border: 1px solid var(--stone);
  border-radius: 30px;
  padding: 40px 30px;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  text-align: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.modal-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(0, 0, 0, 0.02);
  padding: 20px;
  border-radius: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.feature-icon {
  font-size: 1.5rem;
  background: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.feature-text h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.feature-text p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.btn-start {
  background: var(--sage);
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 16px 48px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(94, 110, 86, 0.3);
  font-family: inherit;
  width: 100%;
}

.btn-start:hover {
  background: var(--text-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.btn-start:active {
  transform: translateY(0);
}
</style>
