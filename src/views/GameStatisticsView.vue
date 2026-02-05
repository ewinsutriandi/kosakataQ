<template>
  <div class="immersive-picker-view">

    <div class="card stats-card">
      <h2 class="view-title">Statistik Permainan</h2>
      <div class="stats-filters">
        <router-link
          to="/stats/j30"
          class="filter-chip"
          :class="{ active: $route.params.tipe === 'j30' }"
        >
          Juz 30 & Fatihah
        </router-link>
        <router-link
          to="/stats/all"
          class="filter-chip"
          :class="{ active: $route.params.tipe === 'all' }"
        >
          Semua Surat
        </router-link>
        <router-link
          to="/stats/tier"
          class="filter-chip"
          :class="{ active: $route.params.tipe === 'tier' }"
        >
          Mode Tier (Arsip)
        </router-link>
        <router-link
          to="/stats/level"
          class="filter-chip"
          :class="{ active: $route.params.tipe === 'level' }"
        >
          Mode Level
        </router-link>
      </div>
      <div class="stats-table-container">
        <table class="stats-table">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">{{ $route.params.tipe === 'tier' ? 'Grup' : ($route.params.tipe === 'level' ? 'Level' : 'Surat') }}</th>
              <th scope="col">Σ Main</th>
              <th scope="col">HiScore</th>
              <th scope="col">Ketuntasan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in gameStats" :key="index">
              <th scope="row">
                {{ index + 1 }}
              </th>
              <td>{{ $route.params.tipe === 'tier' ? item.label : ($route.params.tipe === 'level' ? item.label : item.tr_id.nama) }}</td>
              <td>{{ item.stats.win + item.stats.lose }}</td>
              <td>{{ item.stats.hiscore }} / {{ item.stats.maxscore }}</td>
              <td>{{ calculatePercent(item.stats.hiscore, item.stats.maxscore) }}%</td>
            </tr>
            <tr v-if="gameStats.length === 0">
              <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                Belum ada data permainan untuk kategori ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  width: 100%;
  max-width: 800px;
  animation: slide-up 0.4s ease-out;
  margin: 0 var(--spacing-md);
}

.stats-filters {
  display: flex;
  gap: 8px;
  margin-top: 16px; /* Added margin to separate from title */
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-chip {
  padding: 8px 16px;
  border-radius: 50px;
  background: var(--warm-stone);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.filter-chip:hover {
  background: white;
  color: var(--coffee);
  box-shadow: var(--shadow-sm);
}

.filter-chip.active {
  background: var(--coffee);
  color: white;
  box-shadow: var(--shadow-md);
}

.stats-table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.5);
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.stats-table th {
  text-align: left;
  padding: 16px;
  color: var(--text-secondary);
  font-weight: 700;
  border-bottom: 2px solid var(--warm-stone);
}

.stats-table td {
  padding: 16px;
  border-bottom: 1px solid var(--warm-stone);
  color: var(--text-primary);
}

.stats-table tr:last-child td {
  border-bottom: none;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .stats-table th, .stats-table td {
    padding: 12px 8px;
    font-size: 0.8rem;
  }
}
</style>

<script>
export default {
  name: "GameStatisticsView",
  components: {},
  data() {
    return {
      gameStats: [],
    };
  },
  methods: {
    generateStats() {
      this.gameStats = [];
      let logs = this.$store.state.game_logs;
      let tipe = this.$route.params.tipe;

      if (tipe === "tier") {
        this.generateTierStats(logs);
      } else if (tipe === "level") {
        this.generateLevelStats(logs);
      } else {
        this.generateSurahStats(logs, tipe);
      }
    },
    generateSurahStats(logs, tipe) {
      let surahs = this.$store.getters.surahs_all;
      let surah_stats = [];

      // Initialize surah objects
      for (let i = 1; i <= 114; i++) {
        let surah = JSON.parse(JSON.stringify(surahs[i.toString()]));
        surah.idx = i;
        surah.stats = { win: 0, lose: 0, hiscore: 0, maxscore: 0 };
        surah_stats.push(surah);
      }

      // Process logs
      logs.forEach(log => {
        if (log.mode !== 'surah' || !log.suraIdx) return;
        
        let surah = surah_stats[log.suraIdx - 1];
        if (!surah) return;

        if (log.playerWon) surah.stats.win++;
        else surah.stats.lose++;

        if (log.score > surah.stats.hiscore) {
          surah.stats.hiscore = log.score;
          surah.stats.maxscore = log.maxScore;
        }
      });

      // Filter based on type
      if (tipe === "all") {
        this.gameStats = surah_stats;
      } else {
        // Juz 30 + Fatiha
        let filtered = [];
        filtered.push(surah_stats[0]); // Fatihah
        for (let i = 114; i >= 78; i--) {
          filtered.push(surah_stats[i - 1]);
        }
        this.gameStats = filtered;
      }
    },
    generateTierStats(logs) {
      const tiers = {
        '100': { label: 'Kata yang muncul > 100x', stats: { win: 0, lose: 0, hiscore: 0, maxscore: 0 } },
        '50': { label: 'Kata yang muncul 51-100x', stats: { win: 0, lose: 0, hiscore: 0, maxscore: 0 } },
        '10': { label: 'Kata yang muncul 11-50x', stats: { win: 0, lose: 0, hiscore: 0, maxscore: 0 } },
        '5': { label: 'Kata yang muncul 6-10x', stats: { win: 0, lose: 0, hiscore: 0, maxscore: 0 } },
        'rare': { label: 'Kata yang muncul <= 5x', stats: { win: 0, lose: 0, hiscore: 0, maxscore: 0 } },
        'all': { label: 'Semua', stats: { win: 0, lose: 0, hiscore: 0, maxscore: 0 } }
      };

      logs.forEach(log => {
        if (log.mode !== 'tier' || !log.tierId) return;
        
        let tier = tiers[log.tierId];
        if (!tier) return;

        if (log.playerWon) tier.stats.win++;
        else tier.stats.lose++;

        if (log.score > tier.stats.hiscore) {
          tier.stats.hiscore = log.score;
          tier.stats.maxscore = log.maxScore;
        }
      });

      this.gameStats = Object.values(tiers).filter(t => t.stats.win > 0 || t.stats.lose > 0 || t.label === 'Semua');
    },
    generateLevelStats(logs) {
      const levels = {};
      
      logs.forEach(log => {
        if (log.mode !== 'level' || !log.levelId) return;
        
        if (!levels[log.levelId]) {
          levels[log.levelId] = { 
            id: log.levelId,
            label: `Level ${log.levelId}`, 
            stats: { win: 0, lose: 0, hiscore: 0, maxscore: 0 } 
          };
        }
        
        let level = levels[log.levelId];
        if (log.playerWon) level.stats.win++;
        else level.stats.lose++;

        if (log.score > level.stats.hiscore) {
          level.stats.hiscore = log.score;
          level.stats.maxscore = log.maxScore;
        }
      });

      this.gameStats = Object.values(levels).sort((a, b) => a.id - b.id);
    },
    calculatePercent(hiscore, maxscore) {
      if (!maxscore || maxscore === 0) return 0;
      return Math.round((hiscore / maxscore) * 100);
    },
  },
  computed: {},
  watch: {
    '$route': {
      handler: 'generateStats',
      immediate: false
    }
  },
  mounted() {
    this.generateStats();
  },
};
</script>
