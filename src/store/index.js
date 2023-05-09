import Vue from "vue";
import Vuex from "vuex";

import surahs from "./../assets/surah.json";
import surahs_translit_id from "./../assets/surah-translit-id.json";
import ayah_simple from "./../assets/ayah-simple.json";
import ayah_indonesia from "./../assets/ayah-indonesia.json";
import ayah_uthmani from "./../assets/ayah-uthmani.json";
import ayah_word_map from "./../assets/ayah-word-map.json";
import words from "./../assets/word.json";
import words_id from "./../assets/id-word-trans.json";

Vue.use(Vuex);

export default new Vuex.Store({
  state() {
    return {
      surahs: surahs,
      surahs_translit_id: surahs_translit_id,
      ayah_simple: ayah_simple,
      ayah_uthmani: ayah_uthmani,
      ayah_indonesia: ayah_indonesia,
      ayah_word_map: ayah_word_map,
      words: words,
      words_tr_id: words_id,
      game_logs: [],
    };
  },
  getters: {
    surahs_all(state) {
      let surahs = {};
      for (let i = 1; i <= 114; i++) {
        surahs[i.toString()] = state.surahs[i.toString()];
        surahs[i.toString()]["tr_id"] = surahs_translit_id[i.toString()];
      }
      return surahs;
    },
    surahs_j30_plus_fatiha(state) {
      let surahs = {};
      let j30start = 78;
      let j30end = 114;
      surahs["1"] = state.surahs["1"];
      surahs["1"]["tr_id"] = surahs_translit_id["1"];
      for (let i = j30end; i >= j30start; i--) {
        surahs[i.toString()] = state.surahs[i.toString()];
        surahs[i.toString()]["tr_id"] = surahs_translit_id[i.toString()];
      }
      return surahs;
    },
    surah_ayahs: (state) => (idx) => {
      // console.time("surah_ayahs of", idx);
      let surah_ayahs = {};
      let surah = state.surahs[idx];
      for (let i = surah.start; i <= surah.end; i++) {
        surah_ayahs[i] = state.ayah_simple[i];
      }
      // console.timeEnd("surah_ayahs of", idx);
      return surah_ayahs;
    },
    surah_words: (_, getters) => (idx) => {
      let surah_ayahs = getters.surah_ayahs(idx);
      // console.time("surah_words of", idx);
      for (let ayah_idx in surah_ayahs) {
        let ayah_words = getters.ayah_words(ayah_idx);
        surah_ayahs[ayah_idx] = {
          text: surah_ayahs[ayah_idx],
          words: ayah_words,
        };
      }
      // console.timeEnd("surah_words of", idx);
      return surah_ayahs;
    },
    ayah_words: (state) => (ayah_idx) => {
      let ayah_words = [];
      let word_map = ayah_word_map[ayah_idx];
      for (let w_idx = word_map.start; w_idx <= word_map.end; w_idx++) {
        let word = state.words[w_idx];
        word.translation = state.words_tr_id[w_idx];
        ayah_words.push(word);
      }
      //console.log(ayah_idx, ayah_words);
      return ayah_words;
    },
  },
  mutations: {
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
  actions: {},
  modules: {},
});
