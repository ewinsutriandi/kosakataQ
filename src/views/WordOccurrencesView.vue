<template>
  <div class="immersive-picker-view">
    <header class="main-header">
      <div class="header-content">
        <button class="back-btn" @click="$router.push('/word-frequency')">
          ← Kembali
        </button>
        <h1>kosakataQ</h1>
      </div>
      <p class="subtitle">Bermain dan belajar arti kata ayat-ayat al Qur'an</p>
    </header>

    <h2 class="view-title">
      Kemunculan kata <span class="arabic-highlight">{{ wordText }}</span>
    </h2>
    <p class="occurrence-count" v-if="!loading && occurrences.length > 0">
      {{ occurrences.length }}x
    </p>

    <div class="picker-container">
      <div class="picker-wrapper">
        <div class="surah-list" v-if="paginatedOccurrences.length > 0">
          <div
            v-for="(occ, index) in paginatedOccurrences"
            :key="index"
            class="surah-link"
            @click="openModal(occ)"
          >
            <div class="surah-card compact">
              <div class="card-left">
                <span class="surah-index">#{{ (currentPage - 1) * pageSize + index + 1 }}</span>
                <span class="location-text">{{ occ.surahName }}, Ayat {{ occ.ayah }}</span>
              </div>
              <span class="action-icon">📖</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p v-if="loading">Memuat data kemunculan...</p>
          <p v-else>Data kata tidak ditemukan</p>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-container" v-if="totalPages > 1">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1" 
            @click="currentPage--"
          >
            &laquo; Prev
          </button>
          <span class="page-indicator">Halaman {{ currentPage }} dari {{ totalPages }}</span>
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages" 
            @click="currentPage++"
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>

    <!-- Occurrence Detail Modal -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
        <div class="modal-content">
          <button class="modal-close" @click="closeModal">&times;</button>
          
          <div class="modal-header">
            <h3>{{ modalData.surahName }}</h3>
            <span class="modal-ayah-num">Ayat {{ modalData.ayah }}</span>
          </div>

          <div class="modal-body">
            <!-- Word Specific Meaning -->
            <div class="section word-meaning-section">
              <div class="word-info">
                <span class="arabic-word">{{ wordText }}</span>
                <span class="word-translation">{{ modalData.wordMeaning }}</span>
              </div>
            </div>

            <!-- Full Ayah Arabic -->
            <div class="section arabic-section">
              <p class="ayah-text-arabic" v-html="modalData.highlightedArabic"></p>
            </div>

            <!-- Full Ayah Translation -->
            <div class="section translation-section">
              <p class="ayah-translation-id">{{ modalData.ayahTranslation }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "WordOccurrencesView",
  data() {
    return {
      wordText: "",
      occurrences: [],
      surahMap: {},       // From surah-translit-id.json (transliterated names)
      surahMeta: {},      // From surah.json (GAN mapping / start indices)
      wordMap: {},       // From ayah-word-map.json (local index calculation)
      wordTranslations: {}, // From id-word-trans.json
      ayahArabicMap: {},    // From ayah-uthmani.json
      ayahTransMap: {},     // From ayah-indonesia.json
      loading: true,
      currentPage: 1,
      pageSize: 60,
      showModal: false,
      modalData: {
        surahName: "",
        ayah: "",
        wordMeaning: "",
        arabicText: "",
        highlightedArabic: "",
        ayahTranslation: ""
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.resolvedOccurrences.length / this.pageSize);
    },
    paginatedOccurrences() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.resolvedOccurrences.slice(start, end);
    },
    resolvedOccurrences() {
      return this.occurrences.map(occ => ({
        ...occ,
        surahName: this.surahMap[occ.surah]?.nama || occ.surah
      }));
    }
  },
  methods: {
    async fetchWordDetails() {
      const targetWord = this.$route.params.word;
      this.wordText = targetWord;
      this.loading = true;
      
      try {
        // Fetch all required data in parallel
        const responses = await Promise.all([
          fetch('/data/word_frequency.json'),
          fetch('/data/surah-translit-id.json'),
          fetch('/data/surah.json'),
          fetch('/data/ayah-word-map.json'),
          fetch('/data/id-word-trans.json'),
          fetch('/data/ayah-uthmani.json'),
          fetch('/data/ayah-trans-id-indonesian-tanzil.json')
        ]);

        const [
          freqRes, 
          surahTransRes, 
          surahMetaRes, 
          wordMapRes,
          wordTransRes, 
          ayahArabicRes, 
          ayahTransRes
        ] = responses;

        const [
          allWords, 
          surahs, 
          meta, 
          wordMapping,
          wordTrans, 
          arabic, 
          translation
        ] = await Promise.all([
          freqRes.json(),
          surahTransRes.json(),
          surahMetaRes.json(),
          wordMapRes.json(),
          wordTransRes.json(),
          ayahArabicRes.json(),
          ayahTransRes.json()
        ]);

        this.surahMap = surahs;
        this.surahMeta = meta;
        this.wordMap = wordMapping;
        this.wordTranslations = wordTrans;
        this.ayahArabicMap = arabic;
        this.ayahTransMap = translation;
        
        const wordData = allWords.find(w => w.text === targetWord);
        if (wordData) {
          this.occurrences = wordData.occurrences;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    openModal(occ) {
      // 1. Get Surah/Ayah Basic Info
      this.modalData.surahName = occ.surahName;
      this.modalData.ayah = occ.ayah;

      // 2. Get Word Meaning for this specific occurrence index
      this.modalData.wordMeaning = this.wordTranslations[occ.index] || "Makna tidak ditemukan";

      // 3. Calculate Global Ayah Number (GAN)
      // GAN = Start Index of Surah + (Ayah Number - 1)
      const surahStart = this.surahMeta[occ.surah]?.start;
      if (surahStart) {
        const gan = surahStart + (occ.ayah - 1);
        
        // 4. Retrieve Full Ayah Text and Translation using GAN
        const fullText = this.ayahArabicMap[gan] || "";
        this.modalData.arabicText = fullText;
        this.modalData.ayahTranslation = this.ayahTransMap.translations?.[gan] || "";

        // 5. Highlight the word if we have the word map
        const localRange = this.wordMap[gan];
        if (localRange && fullText) {
          const localIndex = occ.index - localRange.start;
          const words = fullText.trim().split(/\s+/);
          
          if (words[localIndex]) {
            words[localIndex] = `<span class="highlight-word">${words[localIndex]}</span>`;
            this.modalData.highlightedArabic = words.join(" ");
          } else {
            this.modalData.highlightedArabic = fullText;
          }
        } else {
          this.modalData.highlightedArabic = fullText;
        }
      }

      this.showModal = true;
      document.body.style.overflow = 'hidden'; // Prevent scroll
    },
    closeModal() {
      this.showModal = false;
      document.body.style.overflow = ''; // Restore scroll
    }
  },
  mounted() {
    this.fetchWordDetails();
  }
};
</script>

<style scoped>
.immersive-picker-view {
  width: 100%;
  min-height: 100%;
  padding-bottom: var(--spacing-xl);
}

.main-header {
  text-align: center;
  margin: 30px 0;
}

.header-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: var(--spacing-md);
  background: none;
  border: 1px solid var(--stone);
  padding: 8px 16px;
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.back-btn:hover {
  border-color: var(--sage);
  color: var(--sage);
  background: white;
}

.main-header h1 {
  font-size: 1.5rem;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0;
}

.subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 10px;
}

.occurrence-count {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: -15px;
  margin-bottom: 25px;
  font-weight: 600;
  opacity: 0.8;
}

.view-title {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--sage);
  margin: 10px 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.arabic-highlight {
  font-family: var(--font-family-arabic);
  font-size: 1.6rem;
  text-transform: none;
  margin-left: 10px;
  color: var(--text-primary);
  vertical-align: middle;
}

.picker-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.picker-wrapper {
  padding-bottom: 2rem;
}

.surah-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 600px) {
  .surah-list {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 900px) {
  .surah-list {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.surah-card {
  width: 100%;
  background: var(--card-white);
  border: 1px solid var(--stone);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.surah-card:hover {
  border-color: var(--sage);
  background: var(--sand);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.surah-card.compact {
  padding: 15px 20px;
  border-radius: 16px;
}

.card-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.surah-index {
  font-size: 0.7rem;
  color: var(--sage);
  font-weight: 700;
  margin-bottom: -2px;
}

.location-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.action-icon {
  font-size: 1.2rem;
  opacity: 0.5;
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px 0;
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px 0;
}

.page-btn {
  background: var(--card-white);
  border: 1px solid var(--stone);
  border-radius: 12px;
  padding: 10px 20px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--sage);
  color: var(--sage);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(43, 62, 48, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: var(--card-white);
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  border-radius: 28px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-slide-up 0.3s ease-out;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: var(--sand);
  border: none;
  border-radius: 50%;
  font-size: 24px;
  color: var(--sage);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  z-index: 10;
}

.modal-close:hover {
  background: var(--stone);
  transform: rotate(90deg);
}

.modal-header {
  padding: 30px 30px 20px;
  border-bottom: 1px solid var(--stone);
}

.modal-header h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  color: var(--sage);
  margin: 0;
}

.modal-ayah-num {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section {
  display: flex;
  flex-direction: column;
}

.word-meaning-section {
  background: var(--sand);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--stone);
}

.word-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arabic-word {
  font-family: 'Amiri', serif;
  font-size: 2.2rem;
  color: var(--text-primary);
  direction: rtl;
}

.word-translation {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--sage);
  text-align: right;
}

.ayah-text-arabic {
  font-family: 'Amiri', serif;
  font-size: 1.8rem;
  line-height: 2;
  color: var(--text-primary);
  direction: rtl;
  text-align: right;
  margin: 0;
}

.ayah-translation-id {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
}

:deep(.highlight-word) {
  color: var(--sage);
  background: rgba(43, 62, 48, 0.08); /* Faint sage background */
  padding: 0 4px;
  border-radius: 6px;
  font-weight: 700;
  box-shadow: 0 0 15px rgba(43, 62, 48, 0.1);
}

/* Animations */
@keyframes modal-slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 500px) {
  .back-btn {
    position: static;
    margin-bottom: 15px;
  }
  .header-content {
    flex-direction: column;
  }
}
</style>
