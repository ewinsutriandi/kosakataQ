<template>
  <div class="immersive-picker-view">
    <button class="back-floating-btn" @click="$router.push('/levels')">
      ← Kembali
    </button>
    
    <h2 class="view-title">Level {{ levelId }}</h2>
    <p class="view-description">{{ words.length }} Kosakata Terpilih</p>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat detail level...</p>
    </div>

    <div v-else class="picker-container">
      <div class="level-info-header">
        <div v-if="levelStats.totalPlays > 0" class="level-stats-row">
          <div class="stat-item">
            <span class="stat-label">Main</span>
            <span class="stat-value">{{ levelStats.totalPlays }}x</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Menang</span>
            <span class="stat-value success">{{ levelStats.wins }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Kalah</span>
            <span class="stat-value failure">{{ levelStats.losses }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">High Score</span>
            <span class="stat-value highlight">{{ levelStats.highScore }} <small>/ {{ levelStats.maxScore }}</small></span>
          </div>
        </div>

        <div v-if="hasSavedSession" class="actions-column" style="width: 100%; max-width: 330px; display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
          <button @click="resumeGame" class="start-play-btn" style="width: 100%; padding: 10px 20px;">
            Lanjutkan Permainan
            <span style="display:block; font-size: 0.8rem; font-weight: normal; margin-top: 4px;">(Sisa {{ savedSessionData.surah_quiz.length - savedSessionData.cur_quiz_idx }} soal)</span>
          </button>
          <button @click="startLevel" class="start-play-btn start-play-btn-secondary" style="width: 100%;">
            Mulai dari awal
          </button>
        </div>
        <button v-else @click="startLevel" class="start-play-btn" style="margin-top: 10px;">
          {{ levelStats.totalPlays > 0 ? 'Main Lagi' : 'Mulai Latihan' }}
        </button>
      </div>

      <div class="word-list">
        <div 
          v-for="(word, index) in words" 
          :key="index" 
          class="word-item"
          @click="$router.push('/word-occurrences/' + word.text)"
        >
          <div class="word-rank">#{{ (levelId - 1) * 50 + index + 1 }}</div>
          <div class="word-content">
            <span class="arabic-text-small">{{ word.text }}</span>
            <span class="occurrence-badge">{{ word.count }}x muncul</span>
          </div>
          <div class="chevron">›</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "LevelDetailView",
  data() {
    return {
      words: [],
      loading: true,
      levelId: parseInt(this.$route.params.levelId)
    };
  },
  computed: {
    ...mapGetters(['isLevelUnlocked']),
    isLocked() {
      return !this.isLevelUnlocked(this.levelId);
    },
    levelStats() {
      let logs = this.$store.state.game_logs || [];
      let levelLogs = logs.filter(log => log.mode === 'level' && log.levelId === this.levelId);
      
      let stats = {
        totalPlays: levelLogs.length,
        wins: 0,
        losses: 0,
        highScore: 0,
        maxScore: 0
      };

      levelLogs.forEach(log => {
        if (log.playerWon) stats.wins++;
        else stats.losses++;

        if (log.score > stats.highScore) {
          stats.highScore = log.score;
          stats.maxScore = log.maxScore;
        }
      });

      return stats;
    },
    hasSavedSession() {
      const sessionId = `level_${this.levelId}`;
      return !!this.$store.state.saved_sessions[sessionId];
    },
    savedSessionData() {
      return this.$store.state.saved_sessions[`level_${this.levelId}`];
    }
  },
  methods: {
    async fetchLevelWords() {
      if (this.isLocked) {
        this.$router.push('/levels');
        return;
      }
      try {
        const response = await fetch('/data/word_frequency.json');
        const allWords = await response.json();
        const start = (this.levelId - 1) * 50;
        const end = start + 50;
        this.words = allWords.slice(start, end);
      } catch (error) {
        console.error("Error fetching level words:", error);
      } finally {
        this.loading = false;
      }
    },
    startLevel() {
      if (this.hasSavedSession) {
        this.$store.commit("clear_session", `level_${this.levelId}`);
      }
      this.$router.push({
        path: `/play/level/${this.levelId}`,
        query: { auto: 'true' }
      });
    },
    resumeGame() {
      this.$router.push({
        path: `/play/level/${this.levelId}`,
        query: { resume: 'true' }
      });
    }
  },
  mounted() {
    this.fetchLevelWords();
  }
};
</script>

<style scoped>
.level-info-header {
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
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

.start-play-btn {
  background: var(--coffee);
  color: white;
  border: 2px solid var(--coffee);
  padding: 12px 40px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(109, 76, 65, 0.3);
}

.start-play-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(109, 76, 65, 0.4);
}

.start-play-btn-secondary {
  background: transparent !important;
  color: var(--coffee) !important;
  border: 2px solid rgba(109, 76, 65, 0.4);
  box-shadow: none !important;
}

.start-play-btn-secondary:hover {
  background: rgba(109, 76, 65, 0.05) !important;
  border-color: var(--coffee);
}

.picker-container {
  max-width: 1200px;
}

.word-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
}

@media (min-width: 768px) {
  .word-list {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1100px) {
  .word-list {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.word-item {
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-amount));
  border: 1px solid var(--surface-glass-border);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.word-item:hover {
  border-color: var(--coffee);
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.word-rank {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  width: 40px;
  opacity: 0.6;
}

.word-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 15px;
}

.arabic-text-small {
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.occurrence-badge {
  font-size: 0.75rem;
  color: var(--sage);
  background: rgba(43, 62, 48, 0.05);
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.chevron {
  color: var(--warm-stone);
  font-size: 1.5rem;
  line-height: 1;
}

@media (max-width: 600px) {
  .view-title {
    font-size: 1.5rem;
  }
  
  .start-play-btn {
    padding: 10px 30px;
    font-size: 1rem;
  }
}
</style>
