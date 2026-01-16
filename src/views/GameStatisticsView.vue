<template>
  <div class="container stats-view">
    <header class="main-header">
      <h1>kosakataQ</h1>
      <p class="subtitle">Bermain dan belajar arti kata ayat-ayat al Qur'an</p>
    </header>

    <div class="card stats-card">
      <h2 class="stats-title">Statistik Permainan</h2>
      <div class="stats-filters">
        <router-link
          to="/stats/j30"
          class="filter-chip"
          :class="{ active: $route.params.tipe !== 'all' }"
        >
          <span class="chip-icon">✨</span> Juz 30 & Fatihah
        </router-link>
        <router-link
          to="/stats/all"
          class="filter-chip"
          :class="{ active: $route.params.tipe === 'all' }"
        >
          <span class="chip-icon">📚</span> All Surahs
        </router-link>
      </div>
      <div class="stats-table-container">
        <table class="stats-table">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Surat</th>
              <th scope="col">Σ Berhasil</th>
              <th scope="col">Σ Gagal</th>
              <th scope="col">HiScore</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(surah, index) in gameStats" :key="index">
              <th scope="row">
                {{ index + 1 }}
              </th>
              <td>{{ surah.tr_id.nama }}</td>
              <td>{{ surah.stats.win }}</td>
              <td>{{ surah.stats.lose }}</td>
              <td>{{ surah.stats.hiscore }} / {{ surah.stats.maxscore }}</td>
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

/* Header Styles (Consistent with SurahPicker) */
.main-header {
  text-align: center;
  margin: 10px 0 30px 0;
}

.main-header h1 {
  font-size: 1.5rem;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 5px;
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
      let logs = this.$store.state.game_logs;
      let surahs = this.$store.getters.surahs_all;
      let surah_stats = [];
      for (let i = 1; i <= 114; i++) {
        let surah = surahs[i.toString()];
        surah.idx = i;
        surah.stats = {
          win: 0,
          lose: 0,
          hiscore: 0,
          maxscore: 0,
          logs: [],
        };
        surah_stats.push(surah);
      }
      for (let i = 0; i < logs.length; i++) {
        let log = logs[i];
        let surah = surah_stats[log.suraIdx - 1];
        surah.stats.logs.push(log);
        if (log.playerWon) {
          surah.stats.win++;
        } else {
          surah.stats.lose++;
        }
        if (log.score > surah.stats.hiscore) {
          surah.stats.hiscore = log.score;
          surah.stats.maxscore = log.maxScore;
        }
      }
      // console.log(surah_stats);
      if (this.$route.params.tipe != "all") {
        // console.log("not all");
        this.gameStats.push(surah_stats[0]); // fatiha
        for (let i = 114; i >= 78; i--) {
          let st = surah_stats[i - 1];
          this.gameStats.push(st);
        }
      } else {
        for (let i = 1; i <= 114; i++) {
          let st = surah_stats[i - 1];
          this.gameStats.push(st);
        }
      }
      // console.log(this.gameStats);
    },
  },
  computed: {},
  mounted() {
    this.generateStats();
  },
};
</script>
