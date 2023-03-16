<template>
  <div
    class="max-w-xl bg-white px-9 p-16 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:rounded-xl sm:px-11"
  >
    <h2 class="ml-3 mb-2 text-sm font-bold leading-7 text-gray-400 sm:truncate">
      Statistik Permainan
    </h2>
    <div class="mt-3 mb-4">
      <router-link
        to="/stats/j30"
        class="text-sm text-blue-500 underline hover:text-gray-400 mb-3 mx-2"
        >Surat pendek</router-link
      >
      <router-link
        to="/stats/all"
        class="text-sm text-blue-500 underline hover:text-gray-400 mb-3 mx-2"
        >Semua surat</router-link
      >
    </div>
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-2 py-2">No.</th>
            <th scope="col" class="px-2 py-2">Surat</th>
            <th scope="col" class="px-2 py-2">Σ Berhasil</th>
            <th scope="col" class="px-2 py-2">Σ Gagal</th>
            <th scope="col" class="px-2 py-2">HiScore</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(surah, index) in gameStats"
            :key="index"
            class="bg-white border-b"
          >
            <th
              scope="row"
              class="px-2 py-2 font-medium text-gray-900 whitespace-nowrap"
            >
              {{ index + 1 }}
            </th>

            <td class="px-2 py-2">{{ surah.tr_id.nama }}</td>
            <td class="px-2 py-2">{{ surah.stats.win }}</td>
            <td class="px-2 py-2">{{ surah.stats.lose }}</td>
            <td class="px-2 py-2">
              {{ surah.stats.hiscore }} / {{ surah.stats.maxscore }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
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
        for (let i = 114; i >= 68; i--) {
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
