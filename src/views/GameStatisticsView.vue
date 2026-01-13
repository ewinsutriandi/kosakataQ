<template>
  <div class="container stats-view">
    <div class="card stats-card">
      <h2 class="stats-title">Statistik Permainan</h2>
      <div class="stats-filters">
        <router-link to="/stats/j30" class="filter-link"
          >Surat pendek</router-link
        >
        <router-link to="/stats/all" class="filter-link"
          >Semua surat</router-link
        >
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
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  display: flex;
  justify-content: center;
}

.stats-card {
  width: 100%;
}

.stats-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.stats-filters {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.filter-link {
  font-size: 0.875rem;
  color: var(--color-primary);
  text-decoration: underline;
}

.filter-link:hover {
  color: var(--color-text-muted);
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
  background-color: var(--color-bg);
  text-transform: uppercase;
  color: var(--color-text);
  font-size: 0.75rem;
}

.stats-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
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
