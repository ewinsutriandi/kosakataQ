<template>
  <div class="immersive-picker-view">
    <button class="back-floating-btn" @click="$router.push('/')">
      ← Beranda
    </button>
    
    <h2 class="view-title">Mode Khusus</h2>
    <p class="view-description">Koleksi mode permainan dan tantangan ekstra</p>

    <div class="picker-container">
      <div class="modes-list">
        
        <!-- Active Mode: Mistakes -->
        <div class="mode-card-wrapper">
          <button 
            @click="playMistakes"
            class="mode-card large-card mistakes-card" 
            :class="{ 'is-disabled': disabledMistakes }"
            :disabled="disabledMistakes"
          >
            <div class="card-icon">🧠</div>
            <div class="card-content">
              <h3>Belajar dari Kesalahan</h3>
              <p>Mainkan ulang maksimal 25 kata terakhir yang pernah dijawab salah pada sesi permainan sebelumnya.</p>
            </div>
            <div class="card-status" :class="{ 'has-errors': totalMistakes > 0 }">
              {{ totalMistakes > 0 ? `${totalMistakes} kata` : 'Belum ada kesalahan' }}
            </div>
          </button>
        </div>

        <!-- Mode Kustom -->
        <div class="mode-card-wrapper">
          <button 
            @click="$router.push('/special-modes/custom')"
            class="mode-card large-card kustom-card"
          >
            <div class="card-icon">⚡</div>
            <div class="card-content">
              <h3>Koleksi Ayat Pilihan</h3>
              <p>Simpan dan pelajari ayat-ayat favoritmu. Buat kustomisasi rentang ayat spesifik (misal: Ayat Kursi atau Doa-Doa Pilihan).</p>
            </div>
            <div class="card-status">
              {{ totalCustomLevels }} level
            </div>
          </button>
        </div>

        <!-- Dummy Mode 1 -->
        <div class="mode-card-wrapper">
          <div class="mode-card large-card locked-card">
            <div class="card-icon">⏱️</div>
            <div class="card-content">
              <h3>Mode Tantangan Waktu</h3>
              <p>Jawab sebanyak mungkin kata dalam waktu 60 detik. Uji kecepatan ingatanmu!</p>
            </div>
            <div class="card-badge">Segera Hadir</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SpecialModeSelectionView",
  computed: {
    totalMistakes() {
      // Calculate unique mistook words
      const logs = this.$store.state.mistake_logs || [];
      const uniqueWords = new Set(logs.map(log => log.word));
      return uniqueWords.size;
    },
    disabledMistakes() {
      return this.totalMistakes === 0;
    },
    totalCustomLevels() {
      return (this.$store.state.custom_levels || []).length;
    }
  },
  methods: {
    playMistakes() {
      if (!this.disabledMistakes) {
        this.$router.push('/play/mistakes');
      }
    }
  }
};
</script>

<style scoped>
.modes-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}

.mode-card-wrapper {
  width: 100%;
}

.mode-card.large-card {
  width: 100%;
  display: flex;
  align-items: center;
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-amount));
  border: 1px solid var(--surface-glass-border);
  border-radius: var(--radius-lg);
  padding: 25px;
  text-align: left;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.mode-card.large-card:hover:not(.locked-card):not(.is-disabled) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--coffee);
}

.card-icon {
  font-size: 3rem;
  margin-right: 20px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.card-content p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  padding-right: 20px;
}

.card-status {
  font-size: 0.85rem;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(0,0,0,0.05);
  color: var(--text-secondary);
  white-space: nowrap;
}

.card-status.has-errors {
  background: rgba(220, 38, 38, 0.1);
  color: #DC2626;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.mistakes-card.is-disabled {
  opacity: 0.7;
  cursor: not-allowed;
  filter: grayscale(1);
}

.locked-card {
  cursor: not-allowed;
  opacity: 0.6;
  background: rgba(0, 0, 0, 0.02);
}

.card-badge {
  position: absolute;
  top: 20px;
  right: -30px;
  background: var(--coffee);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 30px;
  transform: rotate(45deg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 600px) {
  .mode-card.large-card {
    flex-direction: column;
    text-align: center;
    padding: 20px 15px;
  }
  
  .card-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .card-content p {
    padding-right: 0;
    margin-bottom: 15px;
  }
  
  .card-badge {
    right: -35px;
    padding: 4px 40px;
  }
}
</style>
