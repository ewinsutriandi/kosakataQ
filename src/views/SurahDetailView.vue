<template>
  <div class="immersive-picker-view">
    <button class="back-floating-btn" @click="$router.push('/picksurah/j30')">
      ← Kembali
    </button>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat informasi surat...</p>
    </div>

    <div v-else-if="surah" class="picker-container">
      <div class="surah-detail-card glass-card">
        <span class="surah-number">Surah ke-{{ surahIdx }}</span>
        <h2 class="surah-title">{{ surah.name }}</h2>
        <div class="surah-subtitle">
          <h3 class="translit">{{ surah.tr_id.nama }}</h3>
          <span class="meaning">{{ surah.tr_id.arti_nama }}</span>
        </div>

        <div class="meta-pills">
          <span class="pill">{{ surah.nAyah }} Ayat</span>
          <span class="pill">{{ surah.type === 'mekkan' ? 'Makkiyah' : 'Madaniyah' }}</span>
        </div>

        <!-- Statistics Section -->
        <div v-if="stats.totalPlays > 0" class="level-stats-row" style="margin-top: 24px;">
          <div class="stat-item">
            <span class="stat-label">Main</span>
            <span class="stat-value">{{ stats.totalPlays }}x</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Menang</span>
            <span class="stat-value success">{{ stats.wins }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Kalah</span>
            <span class="stat-value failure">{{ stats.losses }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">High Score</span>
            <span class="stat-value highlight">{{ stats.highScore }} <small>/ {{ stats.maxScore }}</small></span>
          </div>
        </div>

        <div class="difficulty-actions" style="margin-top: 40px;">
          <p class="label">Pilih tingkat kesulitan untuk memulai</p>
          <div class="actions-row">
            <button @click="startGame('normal')" class="btn-glass btn-primary">
              Latihan Normal
            </button>
            <button @click="startGame('hard')" class="btn-glass btn-secondary">
              Latihan Menantang
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SurahDetailView",
  data() {
    return {
      surahIdx: this.$route.params.idx,
      surah: null,
      loading: true
    };
  },
  computed: {
    stats() {
      const logs = this.$store.state.game_logs || [];
      const surahLogs = logs.filter(log => 
        log.mode === 'surah' && 
        (parseInt(log.surahIdx) === parseInt(this.surahIdx) || parseInt(log.suraIdx) === parseInt(this.surahIdx))
      );

      let stats = {
        totalPlays: surahLogs.length,
        wins: 0,
        losses: 0,
        highScore: 0,
        maxScore: 0
      };

      surahLogs.forEach(log => {
        if (log.playerWon) stats.wins++;
        else stats.losses++;

        if (log.score > stats.highScore) {
          stats.highScore = log.score;
          stats.maxScore = log.maxScore;
        }
      });

      return stats;
    }
  },
  methods: {
    loadSurah() {
      this.surah = this.$store.getters.surahs_all[this.surahIdx];
      this.loading = false;
    },
    startGame(difficulty) {
      this.$router.push({
        path: `/play/${this.surahIdx}`,
        query: { difficulty }
      });
    }
  },
  mounted() {
    this.loadSurah();
  }
};
</script>

<style scoped>
.surah-detail-card {
  max-width: 500px;
  margin: 40px auto;
  text-align: center;
  padding: 40px var(--spacing-lg) var(--spacing-lg) !important;
}

.surah-number {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  font-weight: 600;
  display: block;
  margin-bottom: var(--spacing-xs);
}

.surah-title {
  font-family: var(--font-family-arabic);
  font-size: 3.5rem;
  color: var(--color-primary);
  line-height: 1.1;
  margin-bottom: var(--spacing-xs);
}

.translit {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--coffee);
  margin: 0;
}

.meaning {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  display: block;
  margin-top: 4px;
}

.meta-pills {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 24px 0;
}

.pill {
  background: rgba(109, 76, 65, 0.08);
  color: var(--coffee);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  border: 1px solid rgba(109, 76, 65, 0.1);
}

.level-stats-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-amount));
  border: 1px solid var(--surface-glass-border);
  padding: 15px 25px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
}

.stat-item:not(:last-child) {
  border-right: 1px solid var(--warm-stone);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}

.stat-value.success { color: #4CAF50; }
.stat-value.failure { color: #DC2626; }
.stat-value.highlight { color: var(--coffee); }

.stat-value small {
  font-size: 0.75rem;
  opacity: 0.6;
}

.difficulty-actions .label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.actions-row {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: var(--coffee);
}

@media (max-width: 600px) {
  .surah-title {
    font-size: 2.8rem;
  }
  .actions-row {
    flex-direction: column;
    width: 100%;
  }
}

/* Glass Buttons Shared with GameScreen */
.btn-glass {
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-glass-border);
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.2s;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn-glass:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  color: var(--coffee);
}

.btn-primary {
  background: var(--coffee);
  color: white;
  border: none;
}
.btn-primary:hover {
  background: #5d4037; /* Slightly darker coffee */
  color: white;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.3);
  color: var(--coffee);
  border: 1px solid var(--coffee);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #5d4037;
}

@media (max-width: 600px) {
  .btn-glass {
    width: 100%;
    padding: 12px;
  }
}
</style>
