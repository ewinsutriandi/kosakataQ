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
  </div>
</template>

<script>
export default {
  name: "WordOccurrencesView",
  data() {
    return {
      wordText: "",
      occurrences: [],
      surahMap: {},
      loading: true,
      currentPage: 1,
      pageSize: 60
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
        // Fetch required data in parallel
        const [freqRes, surahRes] = await Promise.all([
          fetch('/data/word_frequency.json'),
          fetch('/data/surah-translit-id.json')
        ]);

        const [allWords, surahs] = await Promise.all([
          freqRes.json(),
          surahRes.json()
        ]);

        this.surahMap = surahs;
        
        const wordData = allWords.find(w => w.text === targetWord);
        if (wordData) {
          this.occurrences = wordData.occurrences;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
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
