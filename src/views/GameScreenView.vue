<template>
  <div
    class="w-400 bg-white px-9 pt-8 pb-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-auto sm:rounded-xl sm:px-11"
  >
    <!-- Prepare -->
    <div v-if="loading_quiz">
      <loading-indicator />
      Menyiapkan soal
    </div>
    <div v-if="!loading_quiz && $options.quiz_by_aya.length > 0 && !game_on">
      <span class="mb-2 text-sm text-center leading-7 text-gray-400">
        Pilih tingkat kesulitan
      </span>
      <br />
      <button
        @click="startNormal"
        class="h-8 px-1 m-2 w-28 text-sm text-white transition-colors duration-150 bg-blue-400 rounded-lg focus:shadow-outline hover:bg-blue-600"
      >
        Normal
      </button>
      <button
        @click="startHard"
        class="h-8 px-1 m-2 w-28 text-sm text-white transition-colors duration-150 bg-blue-400 rounded-lg focus:shadow-outline hover:bg-blue-600"
      >
        Menantang
      </button>
    </div>
    <!-- Game On -->
    <div v-if="surah_quiz.length > 1 && game_on && !gameEnded">
      <div class="flex justify-center mb-3">
        <div class="flex">
          <heart-indicator num="3" :fail="fail" :key="cur_quiz_idx" />
        </div>
      </div>
      <span class="mb-2 text-sm text-center leading-7 text-gray-400">
        Pilih jawaban yang benar
      </span>
      <br />
      <span class="text-gray-500">Pada ayat:</span>
      <h2 class="mt-4 mb-4 text-2xl text-center font-bold text-blue-400 ayah">
        {{ cur_quiz.ayah_text }}
      </h2>
      <span class="mb-2 text-gray-500">kata </span>
      <span
        class="ml-2 mr-2 mt-4 mb-4 text-2xl text-center font-bold text-blue-400 ayah"
      >
        {{ cur_quiz.word_to_translate }}
      </span>
      <span class="mb-6 text-gray-500"> memiliki arti?</span>

      <div v-for="choice in cur_quiz.choices" :key="choice.translation">
        <button
          @click="answer(choice.translation)"
          class="h-9 px-1 m-2 pl-3 pr-3 w-full text-sm text-white transition-colors duration-150 bg-blue-400 rounded-lg focus:shadow-outline hover:bg-blue-600"
        >
          {{ choice.translation }}
        </button>
      </div>
      <div class="mt-6 text-gray-400">
        skor: {{ score }} | benar: {{ correct }} | salah: {{ fail }}
      </div>
    </div>
    <!-- Game Ended -->
    <div v-if="gameEnded">
      <span class="mb-2 text-sm text-center leading-7 text-gray-400">
        Permainan berakhir
      </span>
      <span
        class="mb-2 text-lg font-semibold text-center leading-7 text-blue-600"
      >
        <div v-if="playerWon">Anda Menang!</div>
      </span>
      <span
        class="mb-2 text-lg font-semibold text-center leading-7 text-red-400"
      >
        <div v-if="!playerWon">Anda Gagal!</div>
      </span>
      <p class="mb-2 text-xl text-center leading-7 text-blue-400">
        Skor {{ score }} dari {{ max_score }}
      </p>
      <p>Jawaban benar: {{ correct }} | salah: {{ fail }}</p>
      <router-link
        to="/"
        class="text-sm text-blue-500 underline hover:text-gray-400"
        >ke halaman utama</router-link
      >
      <div v-if="webShareApiSupported" class="mt-3">
        <score-share :scoreData="scoreData" />
      </div>
    </div>
  </div>
</template>
<script>
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import HeartIndicator from "@/components/HeartIndicator.vue";
import ScoreShare from "@/components/ScoreShare.vue";
import generator from "@/mixin/generator.js";
export default {
  name: "GameScreenView",
  components: { LoadingIndicator, HeartIndicator, ScoreShare },
  mixins: [generator],
  data() {
    return {
      selected: {},
      gameStarted: false,
      gameEnded: false,
      playerWon: false,
      surah_idx: 0,
      ayahs_words: {},
      surah_quiz: [],
      cur_quiz_idx: 0,
      game_on: false,
      score: 0,
      max_score: 0,
      correct: 0,
      fail: 0,
      loading_quiz: false,
    };
  },
  quiz_by_aya: [],
  methods: {
    load_quiz() {
      this.$options.quiz_by_aya = this.generate_quiz_fr_surah(this.surah_idx);
      this.max_score = 0;
      for (let key in Object.keys(this.$options.quiz_by_aya)) {
        let aya_quiz = this.$options.quiz_by_aya[key];
        for (let i = 0; i < aya_quiz.length; i++) {
          let quiz = aya_quiz[i];
          this.max_score += quiz.word_to_translate.length;
        }
      }
    },
    startNormal() {
      let all_quiz = [];
      for (let key in Object.keys(this.$options.quiz_by_aya)) {
        let aya_quiz = this.$options.quiz_by_aya[key];
        aya_quiz = this.randomize(aya_quiz);
        all_quiz = all_quiz.concat(aya_quiz);
      }
      this.surah_quiz = all_quiz;
      this.game_on = true;
    },
    startHard() {
      let all_quiz = [];
      for (let key in Object.keys(this.$options.quiz_by_aya)) {
        let aya_quiz = this.$options.quiz_by_aya[key];
        all_quiz = all_quiz.concat(aya_quiz);
      }
      all_quiz = this.randomize(all_quiz);
      this.surah_quiz = all_quiz;
      this.game_on = true;
    },
    answer(ans) {
      let quiz = this.surah_quiz[this.cur_quiz_idx];
      if (quiz.answer === ans) {
        // console.log("Benar");
        this.score += quiz.word_to_translate.length;
        this.correct++;
      } else {
        // console.log("Salah, jawaban benar:", quiz.answer);
        this.fail++;
        this.showIncorrectAnswerToast(quiz.word_to_translate, quiz.answer);
        if (this.fail == 3) {
          this.gameEnded = true;
          return;
        }
      }
      if (this.cur_quiz_idx < this.surah_quiz.length - 1) {
        this.cur_quiz_idx++;
      } else {
        this.gameEnded = true;
        this.playerWon = true;
      }
    },
    showIncorrectAnswerToast(word, correct_answer) {
      let message = `Arti dari kata <b> ${word} </b> adalah <b>${correct_answer}</b>`;
      this.$toast.open({
        message: message,
        type: "error",
        duration: 2500,
        // all of other options may go here
      });
    },
    heartIndicatorType(index) {
      let lifeLeft = 3 - this.fail;
      if (index <= lifeLeft) {
        return "life";
      }
      return "";
    },
  },
  computed: {
    cur_quiz() {
      let cur_quiz = this.surah_quiz[this.cur_quiz_idx];
      //console.log(this.surah_quiz, cur_quiz, this.cur_quiz_idx);
      return cur_quiz;
    },
    webShareApiSupported() {
      return navigator.share;
    },
    scoreData() {
      return {
        surahIdx: this.surah_idx,
        playerWon: this.playerWon,
        score: this.score,
        maxScore: this.max_score,
        correct: this.correct,
        fail: this.fail,
      };
    },
  },
  mounted() {
    this.surah_idx = this.$route.params.idx;
    this.selected = this.$store.state.surahs[this.surah_idx];
    this.loading_quiz = true;
    setTimeout(() => {
      //console.log("loading quiz");
      this.load_quiz();
      this.loading_quiz = false;
    }, 0);
  },
  beforeRouteLeave(to, from, next) {
    let leave = true;
    if (this.game_on && !this.gameEnded) {
      const answer = window.confirm(
        "Pindah halaman dan keluar dari permainan ini?"
      );
      if (!answer) {
        leave = false;
      }
    }
    // console.log(leave);
    next(leave);
  },
};
</script>
<style>
@font-face {
  font-family: "UthmanTN";
  src: local("UthmanTN"), url(../assets/me_quran_Regular.ttf) format("truetype");
}
.ayah {
  font-family: "UthmanTN", Helvetica, sans-serif;
}
</style>
