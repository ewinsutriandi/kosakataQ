<template>
  <div class="container stats-view">

    <div class="card stats-card">
      <h2 class="stats-title">Statistik Permainan</h2>
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
          Kemunculan Kata
        </router-link>
      </div>
      <div class="stats-table-container">
        <table class="stats-table">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">{{ $route.params.tipe === 'tier' ? 'Grup' : 'Surat' }}</th>
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
              <td>{{ $route.params.tipe === 'tier' ? item.label : item.tr_id.nama }}</td>
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
.stats-view {
  padding-top: var(--spacing-lg);
  padding-bottom: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-card {
  width: 100%;
  max-width: 100%;
}

.stats-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
}

.stats-filters {
  display: flex;
  gap: 10px;
  margin-bottom: var(--spacing-lg);
  overflow-x: auto;
  padding-bottom: 5px;
}

/* Filter Chip Styles */
.filter-chip {
  background: transparent;
  border: 1px solid var(--stone);
  border-radius: 50px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-family: inherit;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  text-decoration: none; /* Remove default link underline */
}

.filter-chip:hover {
  background-color: #efefe8;
  border-color: var(--sage);
  color: var(--text-primary);
}

.filter-chip.active {
  background-color: var(--sage);
  border-color: var(--sage);
  color: white;
  box-shadow: 0 4px 12px rgba(141, 161, 137, 0.3);
  transform: translateY(-1px);
}

.stats-table-container {
  overflow-x: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.stats-table th,
.stats-table td {
  padding: var(--spacing-sm) var(--spacing-xs);
  text-align: left;
}

.stats-table thead {
  background-color: var(--bg); /* Use slight bg for header */
  text-transform: uppercase;
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 700;
}

.stats-table th {
    border-radius: 4px; /* Soften header corners */
}

.stats-table tbody tr {
  border-bottom: 1px solid var(--stone);
}

.stats-table tbody tr:last-child {
  border-bottom: none;
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
        if (log.mode === 'tier' || !log.suraIdx) return;
        
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
