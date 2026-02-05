<template>
  <div class="immersive-view">
    <!-- Loading -->
    <div v-if="loading_quiz" class="loading-state">
      <loading-indicator />
      <p class="animate-pulse">Menyiapkan permainan...</p>
    </div>

    <!-- Prepare Screen (Glass Card) -->
    <div
      v-if="!loading_quiz && !game_on && ((mode === 'surah' && $options.quiz_by_aya.length > 0) || ((mode === 'tier' || mode === 'level') && surah_quiz.length > 0))"
      class="center-container"
    >
      <div class="glass-card prepare-card">
        <button type="button" class="close-game-btn" @click="closeGame" aria-label="Back to Source">
           ✕
        </button>
        <h2 class="prepare-title">Latihan Soal</h2>
        <!-- Surah Info (Surah Mode) -->
        <div v-if="mode === 'surah'" class="surah-header">
          <span class="surah-number">Surah ke-{{ selected.idx }}</span>
          <h2 class="surah-title">{{ selected.name }}</h2>
          <div class="surah-subtitle">
            <h3 class="translit">{{ selected.tr_id.nama }}</h3>
            <span class="meaning">{{ selected.tr_id.arti_nama }}</span>
          </div>
        </div>

        <!-- Tier/Level Info -->
        <div v-else class="surah-header">
          <div class="surah-subtitle">
            <p v-if="mode === 'tier'" class="meaning" style="margin-bottom: 12px; display: block;">Kumpulan kata-kata yang paling sering muncul dalam Al-Qur'an.</p>
            <p v-else class="meaning" style="margin-bottom: 12px; display: block;">Belajar bertahap dengan kelompok 50 kata berdasarkan frekuensi.</p>
            <h3 class="translit">{{ mode === 'tier' ? tierLabel : levelLabel }}</h3>
          </div>
        </div>

        <div v-if="mode === 'surah'" class="meta-pills">
          <span class="pill">{{ selected.nAyah }} Ayat</span>
        </div>
        <div v-else class="meta-pills">
          <span class="pill">{{ surah_quiz.length || 50 }} Kata</span>
        </div>

        <div class="difficulty-actions">
          <p v-if="mode === 'surah'" class="label">Pilih tingkat kesulitan</p>
          <div class="actions-row">
            <button v-if="mode === 'surah'" @click="startNormal" class="btn-glass btn-primary">
              Normal
            </button>
            <button v-if="mode === 'surah'" @click="startHard" class="btn-glass btn-secondary">
              Menantang
            </button>
            <button v-if="mode === 'tier' || mode === 'level'" @click="mode === 'tier' ? startTier() : startLevel()" class="btn-glass btn-primary">
              Mulai Latihan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Game HUD (Full Screen) -->
    <div v-if="surah_quiz.length > 0 && game_on && !gameEnded" class="game-hud">
      <!-- Top HUD -->
      <header class="hud-top">
        <button type="button" class="close-game-btn" @click="closeGame" aria-label="Exit Game">
           ✕
        </button>

        <!-- Header Info -->
        <div class="hud-row">
          <h2 v-if="mode === 'surah'" class="surah-tag-large">{{ selected.tr_id.nama }}</h2>
          <h2 v-else-if="mode === 'tier'" class="surah-tag-large">{{ tierLabel }}</h2>
          <h2 v-else class="surah-tag-large">{{ levelLabel }}</h2>
        </div>

        <!-- Life Indicator (Hearts) -->
        <div class="hud-row">
          <heart-indicator num="3" :fail="fail" :key="cur_quiz_idx" />
        </div>

        <!-- Progress & Score Chips -->
        <div class="hud-row">
          <div class="hud-stats-container">
            <div class="stat-chip progress-chip">
              <span class="chip-label">Soal #</span>
              <span class="chip-value">{{ cur_quiz_idx + 1 }}<span class="divider">/</span>{{ surah_quiz.length }}</span>
            </div>
            <div class="stat-chip score-chip">
              <span class="chip-label">Skor</span>
              <span class="chip-value">{{ score }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content (Centered) -->
      <main class="game-main">
        <transition name="fade-up" mode="out-in">
          <div :key="cur_quiz_idx" class="question-container">
            <span class="context-label">Pada ayat berikut:</span>
            <h2 class="ayah-text" v-html="highlightAyahText(cur_quiz)"></h2>
            <div class="verse-meta" v-if="cur_quiz">
              <span class="surah-label">
                {{ cur_quiz.surahName }} : {{ cur_quiz.ayahIdx }}
              </span>
            </div>

            <div class="query-box">
              <span class="context-label">Kata</span>
              <span class="highlight-word">{{
                cur_quiz.word_to_translate
              }}</span>
              <span class="context-label">memiliki arti...</span>
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

    <!-- Game Ended (Glass Card Redesigned) -->
    <div v-if="gameEnded" class="center-container">
      <div class="glass-card result-card">
        <div class="result-header">
          <h2 class="result-title">{{ playerWon ? 'Selamat!' : 'Latihan Selesai' }}</h2>
          <p class="result-subtitle">{{ playerWon ? 'Anda berhasil! Teruslah belajar.' : 'Jangan menyerah! Ayo coba lagi.' }}</p>
        </div>

        <div class="score-display">
          <div class="score-main">
            <span class="score-val">{{ score }}</span>
            <span class="score-sep">/</span>
            <span class="score-total">{{ max_score }}</span>
          </div>
          <span class="score-label">Skor Akhir</span>
        </div>

        <div class="stats-row">
          <div class="stat-pill success">
            <span class="pill-label">Benar</span>
            <span class="pill-val">{{ correct }}</span>
          </div>
          <div class="stat-pill failure">
            <span class="pill-label">Salah</span>
            <span class="pill-val">{{ fail }}</span>
          </div>
        </div>

        <div class="result-actions">
          <button @click="retryGame" class="btn-glass btn-primary full-width">
            Main Lagi
          </button>
          <button @click="backToSource" class="btn-glass full-width">
            {{ mode === 'tier' ? 'Kembali ke Daftar Kata' : (mode === 'level' ? 'Kembali ke Level' : 'Kembali ke Daftar Surat') }}
          </button>
        </div>

        <div v-if="webShareApiSupported" class="share-section">
          <score-share :scoreData="scoreData" />
        </div>
      </div>
    </div>


    <!-- Wrong Answer Modal -->
    <transition name="fade">
      <div v-if="showWrongModal" class="modal-overlay">
        <div class="glass-card modal-card">
          <h3 class="modal-title failure">Kurang Tepat</h3>
          <div class="modal-desc">
            <p style="margin-bottom: 0.5rem; color: var(--color-text-muted);">
              Arti dari kata <b style="color: var(--color-text)">{{ wrongModalData.word }}</b>
            </p>
            <p style="color: var(--color-text-muted); font-size: 0.85rem;">pada ayat</p>
            <p class="modal-ayah">{{ wrongModalData.ayahText }}</p>
            <p style="margin-bottom: 0.5rem; color: var(--color-text-muted);">adalah</p>
            <h4 style="color: var(--color-primary); font-size: 1.3rem; margin: 0;">
              {{ wrongModalData.correctAnswer }}
            </h4>
          </div>
          <div class="actions-row">
            <button @click="closeWrongModal" class="btn-glass btn-primary">Lanjut</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Exit Confirmation Modal -->


    <transition name="fade">
      <div v-if="showExitModal" class="modal-overlay">
        <div class="glass-card modal-card">
          <h3 class="modal-title">Jeda Permainan</h3>
          <p class="modal-desc">Keluar sekarang akan menghapus progress permainan ini.</p>
          <div class="actions-row">
            <button @click="cancelExit" class="btn-glass">Lanjut Main</button>
            <button @click="confirmExit" class="btn-glass btn-danger">Keluar</button>
          </div>
        </div>
      </div>
    </transition>
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
.prepare-card {
  max-width: 440px;
  text-align: center;
  padding: 40px var(--spacing-lg) var(--spacing-lg) !important;
}

.prepare-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--coffee);
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.surah-number {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  font-weight: 600;
  display: block;
  margin-bottom: var(--spacing-xs);
}

.surah-title {
  font-family: var(--font-family-arabic);
  font-size: 3.5rem;
  color: var(--color-primary);
  line-height: 1.1;
  margin-bottom: var(--spacing-xs);
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

/* HUD Styling */
.game-hud {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.hud-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  gap: 8px; /* Spacing between rows */
  position: relative; /* For absolute positioning of close button */
}

.close-game-btn {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 20;
}

.close-game-btn:hover {
  background: white;
  color: var(--color-danger);
  transform: scale(1.1);
}

.hud-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.surah-tag-large {
  font-size: 1.5rem; /* Larger than before */
  font-weight: 800;
  color: var(--color-primary);
  margin: 0;
}

.score-simple {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-muted);
}
.score-simple .value {
  color: var(--color-text);
}

/* HUD Stats Redesign (Chips) */
.hud-stats-container {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.stat-chip {
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-amount));
  border: 1px solid var(--surface-glass-border);
  padding: 6px 16px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.chip-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.chip-value {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

.chip-value .divider {
  margin: 0 2px;
  color: var(--coffee);
  opacity: 0.5;
  font-weight: 400;
}

.score-chip {
  border-left: 3px solid var(--coffee);
}

.progress-chip {
  border-left: 3px solid var(--text-secondary);
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

.verse-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--spacing-md);
}

.surah-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--coffee);
  background: rgba(109, 76, 65, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(109, 76, 65, 0.2);
}

.ayah-text {
  font-family: "UthmanTN", serif;
  font-size: 2rem;
  font-weight: 500;
  line-height: 1.8;
  color: var(--color-text);
  margin: var(--spacing-lg) 0 8px 0;
}

:deep(.verse-highlight) {
  color: var(--coffee);
  background: rgba(109, 76, 65, 0.12);
  padding: 0 4px;
  border-radius: 8px;
  font-weight: 700;
  box-shadow: 0 0 15px rgba(109, 76, 65, 0.1);
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
  padding-bottom: 0;
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
.result-card {
  max-width: 440px;
  animation: scaleIn 0.5s cubic-bezier(0.2, 1, 0.3, 1);
}

.result-icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2.2rem;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
}

.result-icon-circle.success {
  background: rgba(109, 76, 65, 0.1);
  color: var(--coffee);
}

.result-icon-circle.failure {
  background: rgba(220, 38, 38, 0.05);
  color: #DC2626;
}

.result-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.result-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.score-display {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid var(--stone);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 20px;
}

.score-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.score-val {
  font-size: 3rem;
  font-weight: 800;
  color: var(--coffee);
}

.score-sep {
  font-size: 1.25rem;
  color: var(--stone);
  margin: 0 4px;
}

.score-total {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.score-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 2px;
  font-weight: 700;
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-pill {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 16px;
  background: white;
  border: 1px solid var(--stone);
}

.stat-pill.success {
  border-left: 4px solid var(--coffee);
}

.stat-pill.failure {
  border-left: 4px solid #DC2626;
}

.pill-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
}

.pill-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.full-width {
  width: 100%;
}

.share-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--stone);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.success {
  color: var(--coffee);
}
.failure {
  color: #DC2626;
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

/* Font Face - Moved from duplicate style block */
@font-face {
  font-family: "UthmanTN";
  src: local("UthmanTN"), url(../assets/me_quran_Regular.ttf) format("truetype");
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(60, 64, 48, 0.4);
  backdrop-filter: blur(var(--blur-amount));
  padding: var(--spacing-md);
}

.modal-card {
  max-width: 340px !important;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.modal-desc {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}

.modal-ayah {
  font-family: "UthmanTN", serif;
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--color-text);
  margin: var(--spacing-sm) 0;
  display: block;
}

.btn-danger {
  background: rgba(220, 38, 38, 0.1);
  color: var(--color-danger);
  border-color: rgba(220, 38, 38, 0.2);
}

.btn-danger:hover {
  background: var(--color-danger);
  color: white;
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
      showWrongModal: false,
      wrongModalData: {
        word: "",
        correctAnswer: "",
      },
      confirmedExit: false,
      pendingTarget: null,
      showExitModal: false,
      mode: 'surah', // 'surah', 'tier', or 'level'
      tierId: null,
      tierLabel: '',
      levelId: null,
      levelLabel: '',
    };
  },
  quiz_by_aya: [],
  methods: {
    async load_tier_quiz() {
      this.loading_quiz = true;
      const quiz = await this.generate_quiz_fr_tier(this.tierId);
      this.surah_quiz = quiz; // random by default
      if (quiz.length > 0) {
        this.tierLabel = quiz[0].tierLabel;
      }
      this.max_score = 0;
      for (let q of quiz) {
        this.max_score += q.word_to_translate.length;
      }
      this.loading_quiz = false;
    },
    async load_level_quiz() {
      this.loading_quiz = true;
      const quiz = await this.generate_quiz_fr_level(this.levelId);
      this.surah_quiz = quiz;
      if (quiz.length > 0) {
        this.levelLabel = quiz[0].levelLabel;
      }
      this.max_score = 0;
      for (let q of quiz) {
        this.max_score += q.word_to_translate.length;
      }
      this.loading_quiz = false;
    },
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
    startTier() {
      this.game_on = true;
    },
    startLevel() {
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
        this.score += quiz.word_to_translate.length;
        this.correct++;
        this.showCorrectAnswerToast(quiz.word_to_translate, quiz.answer);
        this.advanceGame();
      } else {
        this.fail++;
        // Show blocking modal instead of toast
        this.wrongModalData = {
          word: quiz.word_to_translate,
          correctAnswer: quiz.answer,
          ayahText: quiz.ayah_text,
        };
        this.showWrongModal = true;
        // Game does NOT advance yet. Waits for modal close.
      }
    },
    advanceGame() {
      // Check failure condition
      if (this.fail >= 3) {
        this.endGame();
        return;
      }

      // Next question or win
      if (this.cur_quiz_idx < this.surah_quiz.length - 1) {
        this.cur_quiz_idx++;
      } else {
        this.gameEnded = true;
        this.playerWon = true;
        this.endGame();
      }
    },
    closeWrongModal() {
      this.showWrongModal = false;
      this.advanceGame();
    },
    endGame() {
      this.gameEnded = true;
      let log = {
        mode: this.mode,
        playerWon: this.playerWon,
        score: this.score,
        maxScore: this.max_score,
        correct: this.correct,
        fail: this.fail,
        timestamp: Date.now(),
      };
      if (this.mode === 'surah') {
        log.suraIdx = this.surah_idx;
      } else if (this.mode === 'tier') {
        log.tierId = this.tierId;
        log.tierLabel = this.tierLabel;
      } else if (this.mode === 'level') {
        log.levelId = this.levelId;
        log.levelLabel = this.levelLabel;
      }
      this.$store.commit("add_game_log", log);
    },
    showIncorrectAnswerToast(word, correct_answer) {
      // Deprecated in favor of modal, keeping if needed for fallback
      let message = `Salah, arti dari kata <b> ${word} </b> adalah <b>${correct_answer}</b>`;
      this.$toast.open({
        message: message,
        type: "error",
        duration: 2500,
        position: "top-right",
      });
    },
    showCorrectAnswerToast(word, correct_answer) {
      let message = `Benar, arti kata <b> ${word} </b> adalah <b>${correct_answer}</b>`;
      this.$toast.open({
        message: message,
        type: "success",
        duration: 2500,
        position: "top-right",
      });
    },
    heartIndicatorType(index) {
      let lifeLeft = 3 - this.fail;
      if (index <= lifeLeft) {
        return "life";
      }
      return "";
    },
    closeGame() {
      // Intelligently go back to where we started
      this.backToSource();
    },
    confirmExit() {
      this.confirmedExit = true;
      this.showExitModal = false;
      if (this.pendingTarget) {
        this.$router.push(this.pendingTarget).catch(() => {});
      } else {
        this.$router.push("/").catch(() => {});
      }
    },
    cancelExit() {
      this.showExitModal = false;
      this.pendingTarget = null;
    },
    retryGame() {
      this.cur_quiz_idx = 0;
      this.score = 0;
      this.correct = 0;
      this.fail = 0;
      this.playerWon = false;
      this.gameEnded = false;
      this.game_on = false;
      
      if (this.mode === 'tier') {
        this.load_tier_quiz();
      } else if (this.mode === 'level') {
        this.load_level_quiz();
      } else {
        this.load_quiz();
      }
    },
    backToSource() {
      this.confirmedExit = true; // Avoid exit modal
      if (this.mode === 'tier') {
        this.$router.push({ path: "/word-frequency", query: { group: this.tierId } }).catch(() => {});
      } else if (this.mode === 'level') {
        this.$router.push({ path: `/level/${this.levelId}` }).catch(() => {});
      } else {
        this.$router.push("/picksurah/j30").catch(() => {});
      }
    },
    normalizeArabic(text) {
      if (!text) return "";
      return text
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
        .replace(/[۞۩۝]/g, "")
        .replace(/[ٱإأآ]/g, "ا")
        .replace(/[یى]/g, "ي")
        .replace(/ک/g, "ك")
        .trim();
    },
    highlightAyahText(quiz) {
      if (!quiz || !quiz.ayah_text || quiz.wordIndex === undefined) return quiz?.ayah_text || "";

      const surahIdx = quiz.surahIdx;
      const ayahNum = quiz.ayahIdx; // 1-based index within surah
      
      const surahMeta = this.$store.state.surahs[surahIdx];
      if (!surahMeta) return quiz.ayah_text;

      const gan = surahMeta.start + (ayahNum - 1);
      const localRange = this.$store.state.ayah_word_map[gan];
      if (!localRange) return quiz.ayah_text;

      const targetLocalWordIndex = quiz.wordIndex - localRange.start;
      const allTokens = quiz.ayah_text.trim().split(/\s+/);
      const targetNormalized = this.normalizeArabic(quiz.word_to_translate);

      // Identify word tokens for highlighting logic
      const wordTokenIndices = [];
      allTokens.forEach((t, i) => {
        if (this.normalizeArabic(t).length > 0) {
          wordTokenIndices.push(i);
        }
      });

      // Determine bestMatchIndex (Shimmy-proof logic)
      let bestMatchIndex = -1;
      if (wordTokenIndices[targetLocalWordIndex] !== undefined) {
        const originalIdx = wordTokenIndices[targetLocalWordIndex];
        if (this.normalizeArabic(allTokens[originalIdx]) === targetNormalized) {
          bestMatchIndex = originalIdx;
        }
      }
      
      if (bestMatchIndex === -1) {
        for (let offset = -2; offset <= 2; offset++) {
          const idx = targetLocalWordIndex + offset;
          if (wordTokenIndices[idx] !== undefined) {
            const originalIdx = wordTokenIndices[idx];
            if (this.normalizeArabic(allTokens[originalIdx]) === targetNormalized) {
              bestMatchIndex = originalIdx;
              break;
            }
          }
        }
      }

      // Reconstruct HTML
      if (bestMatchIndex !== -1) {
        return allTokens.map((token, idx) => {
          if (idx === bestMatchIndex) {
            return `<span class="verse-highlight">${token}</span>`;
          }
          return token;
        }).join(" ");
      }

      return quiz.ayah_text;
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
        mode: this.mode,
        surahIdx: this.surah_idx,
        tierLabel: this.tierLabel,
        levelLabel: this.levelLabel,
        playerWon: this.playerWon,
        score: this.score,
        maxScore: this.max_score,
        correct: this.correct,
        fail: this.fail,
      };
    },
  },
  mounted() {
    if (this.$route.params.tierId) {
      this.mode = 'tier';
      this.tierId = this.$route.params.tierId;
      this.load_tier_quiz();
    } else if (this.$route.params.levelId) {
      this.mode = 'level';
      this.levelId = parseInt(this.$route.params.levelId);
      this.load_level_quiz();
    } else {
      this.mode = 'surah';
      this.surah_idx = this.$route.params.idx;
      this.selected = this.$store.getters.surahs_all[this.surah_idx];
      this.loading_quiz = true;
      setTimeout(() => {
        //console.log("loading quiz");
        this.load_quiz();
        this.loading_quiz = false;
      }, 0);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.game_on && !this.gameEnded && !this.confirmedExit) {
      // Cancel immediate navigation and show modal
      this.pendingTarget = to;
      this.showExitModal = true;
      next(false);
    } else {
      // Allow navigation if game ended or exit confirmed
      next();
    }
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
