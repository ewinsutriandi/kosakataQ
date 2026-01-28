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
        <div class="surah-list" v-if="allGroupedOccurrences.length > 0">
          <div v-for="group in allGroupedOccurrences" :key="group.surahId" class="surah-group">
            <div class="surah-group-header">
              <span class="header-surah-name">{{ group.surahName }}</span>
              <span class="header-count">{{ group.items.length }} Kali</span>
            </div>

            <div class="ayah-inline-list">
              <span 
                v-for="(occ, idx) in group.items" 
                :key="occ.index"
                class="ayah-link-wrapper"
              >
                <button class="ayah-inline-link" @click="openModal(occ)">
                  Ayat {{ occ.ayah }}
                </button>
                <span v-if="idx < group.items.length - 1" class="comma">, </span>
              </span>
            </div>
          </div>
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
    allGroupedOccurrences() {
      const groups = [];
      this.occurrences.forEach((occ, index) => {
        const surahName = this.surahMap[occ.surah]?.nama || occ.surah;
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.surahId === occ.surah) {
          lastGroup.items.push({ ...occ, surahName, globalIndex: index + 1 });
        } else {
          groups.push({
            surahId: occ.surah,
            surahName,
            items: [{ ...occ, surahName, globalIndex: index + 1 }]
          });
        }
      });
      return groups;
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
    normalizeArabic(text) {
      if (!text) return "";
      return text
        // 1. Remove common diacritics (Harakat)
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
        // 2. Normalize symbols/special chars to empty
        .replace(/[۞۩۝]/g, "")
        // 3. Normalize Alif variations
        .replace(/[ٱإأآ]/g, "ا")
        // 4. Normalize Yeh variations
        .replace(/[یى]/g, "ي")
        // 5. Normalize Kaf variations
        .replace(/ک/g, "ك")
        .trim();
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
          const targetIndex = occ.index - localRange.start;
          const allTokens = fullText.trim().split(/\s+/);
          
          // Identify only tokens that are actual words (not just symbols like ۞)
          const wordTokens = allTokens.map((t, i) => ({ text: t, originalIndex: i }))
            .filter(item => {
              // A token is a word if it contains at least one Arabic character
              // and is not just a stand-alone symbol
              const normalized = this.normalizeArabic(item.text);
              return normalized.length > 0;
            });

          let bestMatchIndex = -1;
          const targetNormalized = this.normalizeArabic(this.wordText);

          // Attempt 1: Check the position indicated by the index
          if (wordTokens[targetIndex]) {
            const candidate = this.normalizeArabic(wordTokens[targetIndex].text);
            if (candidate === targetNormalized) {
              bestMatchIndex = wordTokens[targetIndex].originalIndex;
            }
          }

          // Attempt 2: "Shimmy" logic - look in the immediate neighborhood if not an exact match
          if (bestMatchIndex === -1) {
            for (let offset = -2; offset <= 2; offset++) {
              const idx = targetIndex + offset;
              if (wordTokens[idx]) {
                const candidate = this.normalizeArabic(wordTokens[idx].text);
                if (candidate === targetNormalized) {
                  bestMatchIndex = wordTokens[idx].originalIndex;
                  break;
                }
              }
            }
          }

          // Fallback: If still no match, try to find the word anywhere in the ayah word tokens
          if (bestMatchIndex === -1) {
            const match = wordTokens.find(w => this.normalizeArabic(w.text) === targetNormalized);
            if (match) bestMatchIndex = match.originalIndex;
          }

          if (bestMatchIndex !== -1) {
            allTokens[bestMatchIndex] = `<span class="highlight-word">${allTokens[bestMatchIndex]}</span>`;
            this.modalData.highlightedArabic = allTokens.join(" ");
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
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.surah-group {
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.4);
  padding: 20px 25px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  width: 100%;
}

.surah-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(43, 62, 48, 0.08);
}

.header-surah-name {
  font-weight: 800;
  color: var(--text-primary);
  font-size: 1.2rem;
  letter-spacing: -0.01em;
}

.header-count {
  font-size: 0.75rem;
  color: var(--sage);
  font-weight: 700;
  background: rgba(43, 62, 48, 0.06);
  padding: 4px 10px;
  border-radius: 12px;
}

.ayah-inline-list {
  display: block;
  line-height: 1.8;
  color: var(--text-secondary);
}

.ayah-link-wrapper {
  display: inline;
}

.ayah-inline-link {
  display: inline;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--sage);
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: rgba(43, 62, 48, 0.2);
  text-underline-offset: 3px;
  transition: all 0.2s;
}

.ayah-inline-link:hover {
  color: var(--text-primary);
  text-decoration-color: var(--sage);
}

.comma {
  color: var(--text-secondary);
  font-weight: 400;
  margin-right: 4px;
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
