<template>
  <div class="immersive-view">
    <!-- Loading -->
    <div v-if="loading_quiz" class="loading-state">
      <loading-indicator />
      <p class="animate-pulse">Menyiapkan suasana...</p>
    </div>

    <!-- Prepare Screen (Glass Card) -->
    <div
      v-if="!loading_quiz && $options.quiz_by_aya.length > 0 && !game_on"
      class="center-container"
    >
      <div class="glass-card prepare-card">
        <div class="surah-header">
          <h2 class="surah-title">{{ selected.name }}</h2>
          <div class="surah-subtitle">
            <h3 class="translit">{{ selected.tr_id.nama }}</h3>
            <span class="meaning">{{ selected.tr_id.arti_nama }}</span>
          </div>
        </div>

        <div class="meta-pills">
          <span class="pill">{{ selected.idx }}</span>
          <span class="pill">{{ selected.nAyah }} Ayat</span>
        </div>

        <div class="difficulty-actions">
          <p class="label">Mulai perjalanan</p>
          <div class="actions-row">
            <button @click="startNormal" class="btn-glass btn-primary">
              Normal
            </button>
            <button @click="startHard" class="btn-glass btn-secondary">
              Menantang
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Game HUD (Full Screen) -->
    <div v-if="surah_quiz.length > 1 && game_on && !gameEnded" class="game-hud">
      <!-- Top HUD -->
      <header class="hud-top">
        <div class="hud-left">
          <heart-indicator num="3" :fail="fail" :key="cur_quiz_idx" />
        </div>
        <div class="hud-center">
          <span class="surah-tag">{{ selected.tr_id.nama }}</span>
        </div>
        <div class="hud-right">
          <div class="score-pill">
            <span class="label">Skor</span>
            <span class="value">{{ score }}</span>
          </div>
        </div>
      </header>

      <!-- Main Content (Centered) -->
      <main class="game-main">
        <transition name="fade-up" mode="out-in">
          <div :key="cur_quiz_idx" class="question-container">
            <span class="context-label">Pada ayat berikut:</span>
            <h2 class="ayah-text">
              {{ cur_quiz.ayah_text }}
            </h2>

            <div class="query-box">
              <span class="context-label">Kata</span>
              <span class="highlight-word">{{
                cur_quiz.word_to_translate
              }}</span>
              <span class="context-label">artinya...</span>
            </div>
          </div>
        </transition>
      </main>

      <!-- Bottom Answers -->
      <footer class="game-bottom">
        <div class="choices-grid">
          <button
            v-for="(choice, index) in cur_quiz.choices"
            :key="index"
            @click="answer(choice.translation)"
            class="btn-glass btn-choice"
          >
            {{ choice.translation }}
          </button>
        </div>
      </footer>
    </div>

    <!-- Game Ended (Glass Card) -->
    <div v-if="gameEnded" class="center-container">
      <div class="glass-card result-card">
        <div class="result-header">
          <h2 v-if="playerWon" class="result-title success">Selesai!</h2>
          <h2 v-else class="result-title failure">Coba Lagi</h2>
        </div>

        <div class="score-display">
          <div class="big-score">{{ score }}</div>
          <span class="max-score">dari {{ max_score }}</span>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <span class="label">Benar</span>
            <span class="val success">{{ correct }}</span>
          </div>
          <div class="stat-item">
            <span class="label">Salah</span>
            <span class="val failure">{{ fail }}</span>
          </div>
        </div>

        <router-link to="/" class="btn-glass btn-home">
          Kembali ke Beranda
        </router-link>

        <div v-if="webShareApiSupported" class="mt-6">
          <score-share :scoreData="scoreData" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout Containers */
.immersive-view {
  width: 100%;
  height: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}

.center-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

/* Glass Cards */
.glass-card {
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-amount));
  border: 1px solid var(--surface-glass-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

/* Prepare Screen Styling */
.surah-title {
  font-family: var(--font-family-arabic);
  font-size: 3.5rem;
  color: var(--color-primary);
  line-height: 1.2;
}

.surah-subtitle {
  margin-top: var(--spacing-xs);
}

.translit {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.meaning {
  color: var(--color-text-muted);
}

.meta-pills {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin: var(--spacing-lg) 0;
}

.pill {
  background: rgba(255, 255, 255, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.actions-row {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.label {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

/* Glass Buttons */
.btn-glass {
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-glass-border);
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  color: var(--color-text);
}

.btn-glass:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  color: var(--color-primary);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  color: white;
}

.btn-secondary {
  /* Outline style */
}

/* HUD Styling */
.game-hud {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.hud-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
}

.hud-left,
.hud-right {
  flex: 1;
}

.hud-right {
  display: flex;
  justify-content: flex-end;
}

.surah-tag {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.6;
}

.score-pill {
  background: var(--surface-glass);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  box-shadow: var(--shadow-sm);
}
.score-pill .label {
  margin: 0;
}
.score-pill .value {
  font-weight: 800;
  color: var(--color-primary);
}

/* Game Main */
.game-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-md);
}

.question-container {
  width: 100%;
  max-width: 600px;
}

.ayah-text {
  font-family: "UthmanTN", serif;
  font-size: 2.5rem;
  line-height: 1.8;
  color: var(--color-text);
  margin: var(--spacing-lg) 0;
}

.query-box {
  background: var(--surface-glass);
  backdrop-filter: blur(4px);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
}

.highlight-word {
  font-family: "UthmanTN", serif;
  font-size: 2rem;
  color: var(--color-secondary);
}

.context-label {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

/* Bottom Actions */
.game-bottom {
  padding: var(--spacing-md);
  padding-bottom: 0; /* floating dock handles space */
}

.choices-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.btn-choice {
  text-align: center;
  height: 100%;
}

/* Result Styles */
.result-header {
  margin-bottom: var(--spacing-lg);
}
.success {
  color: var(--color-success);
}
.failure {
  color: var(--color-danger);
}

.score-display {
  margin-bottom: var(--spacing-lg);
}
.big-score {
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
}
.stats-row {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}
.stat-item {
  display: flex;
  flex-direction: column;
}
.stat-item .val {
  font-size: 1.5rem;
  font-weight: 700;
}
.btn-home {
  display: block;
  text-decoration: none;
}

/* Transitions */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
}
.fade-up-enter {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 640px) {
  .choices-grid {
    grid-template-columns: 1fr;
  }
  .ayah-text {
    font-size: 1.8rem;
  }
}
</style>
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
      surah: null,
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
        this.showCorrectAnswerToast(quiz.word_to_translate, quiz.answer);
      } else {
        // console.log("Salah, jawaban benar:", quiz.answer);
        this.fail++;
        this.showIncorrectAnswerToast(quiz.word_to_translate, quiz.answer);
        if (this.fail == 3) {
          this.endGame();
          return;
        }
      }
      if (this.cur_quiz_idx < this.surah_quiz.length - 1) {
        this.cur_quiz_idx++;
      } else {
        this.gameEnded = true;
        this.playerWon = true;
        this.endGame();
      }
    },
    endGame() {
      this.gameEnded = true;
      let log = {
        suraIdx: this.surah_idx,
        playerWon: this.playerWon,
        score: this.score,
        maxScore: this.max_score,
        correct: this.correct,
        fail: this.fail,
        timestamp: Date.now(),
      };
      this.$store.commit("add_game_log", log);
    },
    showIncorrectAnswerToast(word, correct_answer) {
      let message = `Salah, arti dari kata <b> ${word} </b> adalah <b>${correct_answer}</b>`;
      this.$toast.open({
        message: message,
        type: "error",
        duration: 2500,
        // all of other options may go here
      });
    },
    showCorrectAnswerToast(word, correct_answer) {
      let message = `Benar, arti kata <b> ${word} </b> adalah <b>${correct_answer}</b>`;
      this.$toast.open({
        message: message,
        type: "success",
        duration: 2500,
        // all of other options may go here
        position: "top",
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
    this.selected = this.$store.getters.surahs_all[this.surah_idx];
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
      surah: null,
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
        this.showCorrectAnswerToast(quiz.word_to_translate, quiz.answer);
      } else {
        // console.log("Salah, jawaban benar:", quiz.answer);
        this.fail++;
        this.showIncorrectAnswerToast(quiz.word_to_translate, quiz.answer);
        if (this.fail == 3) {
          this.endGame();
          return;
        }
      }
      if (this.cur_quiz_idx < this.surah_quiz.length - 1) {
        this.cur_quiz_idx++;
      } else {
        this.gameEnded = true;
        this.playerWon = true;
        this.endGame();
      }
    },
    endGame() {
      this.gameEnded = true;
      let log = {
        suraIdx: this.surah_idx,
        playerWon: this.playerWon,
        score: this.score,
        maxScore: this.max_score,
        correct: this.correct,
        fail: this.fail,
        timestamp: Date.now(),
      };
      this.$store.commit("add_game_log", log);
    },
    showIncorrectAnswerToast(word, correct_answer) {
      let message = `Salah, arti dari kata <b> ${word} </b> adalah <b>${correct_answer}</b>`;
      this.$toast.open({
        message: message,
        type: "error",
        duration: 2500,
        // all of other options may go here
      });
    },
    showCorrectAnswerToast(word, correct_answer) {
      let message = `Benar, arti kata <b> ${word} </b> adalah <b>${correct_answer}</b>`;
      this.$toast.open({
        message: message,
        type: "success",
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
    this.selected = this.$store.getters.surahs_all[this.surah_idx];
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
