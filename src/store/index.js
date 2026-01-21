import Vue from "vue";
import Vuex from "vuex";
import localforage from "localforage";

Vue.use(Vuex);

// Configure localforage
localforage.config({
  name: "kosakataQ",
  storeName: "game_data",
});

const RESOURCES = [
  { key: "surahs", file: "surah.json", description: "Meta Data Surah" },
  { key: "surahs_translit_id", file: "surah-translit-id.json", description: "Transliterasi Judul Surah" },
  { key: "ayah_simple", file: "ayah-simple.json", description: "Teks Ayat Simple" },
  { key: "ayah_indonesia", file: "ayah-indonesia.json", description: "Terjemahan Bahasa Indonesia" },
  { key: "ayah_uthmani", file: "ayah-uthmani.json", description: "Teks Ayat Uthmani" },
  { key: "ayah_word_map", file: "ayah-word-map.json", description: "Mapping Kata per Kata" },
  { key: "words", file: "word.json", description: "Database Kosakata" },
  { key: "words_tr_id", file: "id-word-trans.json", description: "Terjemahan Kosakata" },
];

export default new Vuex.Store({
  state() {
    return {
      isLoading: true,
      loadingProgress: 0,
      loadingMessage: "Initializing...",
      // Data containers
      surahs: {},
      surahs_translit_id: {},
      ayah_simple: {},
      ayah_uthmani: {},
      ayah_indonesia: {},
      ayah_word_map: {},
      words: {},
      words_tr_id: {},
      game_logs: [],
    };
  },
  getters: {
    isDataReady(state) {
      return !state.isLoading;
    },
    surahs_all(state) {
      if (state.isLoading) return {};
      let surahs = {};
      for (let i = 1; i <= 114; i++) {
        if (state.surahs[i.toString()]) {
          surahs[i.toString()] = state.surahs[i.toString()];
          surahs[i.toString()]["tr_id"] = state.surahs_translit_id[i.toString()];
        }
      }
      return surahs;
    },
    surahs_j30_plus_fatiha(state) {
      if (state.isLoading) return {};
      let surahs = {};
      let j30start = 78;
      let j30end = 114;

      if (state.surahs["1"]) {
        surahs["1"] = state.surahs["1"];
        surahs["1"]["tr_id"] = state.surahs_translit_id["1"];
      }

      for (let i = j30end; i >= j30start; i--) {
        if (state.surahs[i.toString()]) {
          surahs[i.toString()] = state.surahs[i.toString()];
          surahs[i.toString()]["tr_id"] = state.surahs_translit_id[i.toString()];
        }
      }
      return surahs;
    },
    surah_ayahs: (state) => (idx) => {
      if (state.isLoading || !state.surahs[idx]) return {};
      let surah_ayahs = {};
      let surah = state.surahs[idx];
      for (let i = surah.start; i <= surah.end; i++) {
        surah_ayahs[i] = state.ayah_simple[i];
      }
      return surah_ayahs;
    },
    surah_words: (_, getters) => (idx) => {
      let surah_ayahs = getters.surah_ayahs(idx);
      for (let ayah_idx in surah_ayahs) {
        let ayah_words = getters.ayah_words(ayah_idx);
        surah_ayahs[ayah_idx] = {
          text: surah_ayahs[ayah_idx],
          words: ayah_words,
        };
      }
      return surah_ayahs;
    },
    ayah_words: (state) => (ayah_idx) => {
      if (state.isLoading || !state.ayah_word_map[ayah_idx]) return [];
      let ayah_words = [];
      let word_map = state.ayah_word_map[ayah_idx];
      for (let w_idx = word_map.start; w_idx <= word_map.end; w_idx++) {
        let word = state.words[w_idx];
        if (word) {
          word.translation = state.words_tr_id[w_idx];
          ayah_words.push(word);
        }
      }
      return ayah_words;
    },
  },
  mutations: {
    SET_DATA(state, { key, data }) {
      state[key] = data;
    },
    SET_LOADING(state, { isLoading, progress, message }) {
      state.isLoading = isLoading;
      if (progress !== undefined) state.loadingProgress = progress;
      if (message !== undefined) state.loadingMessage = message;
    },
    initializeVars(state) {
      if (localStorage.getItem("game_logs")) {
        state.game_logs = JSON.parse(localStorage.game_logs);
      }
    },
    add_game_log(state, log) {
      state.game_logs.push(log);
      localStorage.setItem("game_logs", JSON.stringify(state.game_logs));
    },
  },
  actions: {
    async initData({ commit }) {
      // await localforage.clear(); 

      commit("SET_LOADING", { isLoading: true, progress: 0, message: "Memeriksa data lokal..." });

      const totalResources = RESOURCES.length;
      let loadedCount = 0;

      try {
        for (const resource of RESOURCES) {
          const { key, file, description } = resource;

          // Try to get from cache first
          let data = await localforage.getItem(key);

          if (!data) {
            commit("SET_LOADING", {
              isLoading: true,
              progress: Math.floor((loadedCount / totalResources) * 100),
              message: `Mengunduh ${description}...`
            });

            // Artificial Delay for testing
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch(`/data/${file}`);
            if (!response.ok) throw new Error(`Failed to load ${file}`);

            data = await response.json();

            // Save to cache
            await localforage.setItem(key, data);
          }

          commit("SET_DATA", { key, data });
          loadedCount++;
          commit("SET_LOADING", {
            isLoading: true,
            progress: Math.floor((loadedCount / totalResources) * 100),
            message: `Memuat ${description}...`
          });
        }

        commit("SET_LOADING", { isLoading: false, progress: 100, message: "Siap!" });

      } catch (error) {
        console.error("Failed to load data:", error);
        commit("SET_LOADING", {
          isLoading: true, // Keep loading state to show error
          progress: 0,
          message: "Gagal memuat data. Silakan refresh."
        });
      }
    }
  },
  modules: {},
});
