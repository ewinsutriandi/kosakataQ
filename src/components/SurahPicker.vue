<template>
  <div class="grid grid-cols-2 md:grid-cols-5" v-if="surah_list.length > 0">
    <div v-for="(value, key) in surah_list" :key="key">
      <router-link :to="'/play/' + value.idx">
        <button
          v-if="value.tr_id"
          class="h-8 px-1 m-2 w-28 text-sm text-white transition-colors duration-150 bg-blue-400 rounded-lg focus:shadow-outline hover:bg-blue-600"
        >
          {{ value.tr_id.nama }}
        </button>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "SurahPicker",
  props: ["tipe"],
  data() {
    return {
      surah_list: [],
    };
  },
  methods: {
    generate_surah_list() {
      //console.log("props: all sura = ", this.tipe);
      if (this.tipe === "all") {
        //console.log("generate surah list");
        let surahs = this.$store.getters.surahs_all;
        let surah_list = [];
        for (let i = 1; i <= 114; i++) {
          let surah = surahs[i.toString()];
          surah.idx = i;
          surah_list.push(surah);
        }
        //console.log("surah_list: ", surah_list.length);
        this.surah_list = surah_list;
      } else {
        let surahs = this.$store.getters.surahs_j30_plus_fatiha;
        let al_fatiha = surahs["1"];
        al_fatiha.idx = 1;
        let reordered_surahs = [al_fatiha];
        for (let i = 114; i >= 78; i--) {
          let surah = surahs[i.toString()];
          surah.idx = i;
          reordered_surahs.push(surah);
        }
        this.surah_list = reordered_surahs;
      }
    },
  },
  mounted() {
    this.generate_surah_list();
  },
};
</script>
