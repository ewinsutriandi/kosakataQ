<template>
  <div class="immersive-picker-view">

    <h2 class="view-title">Kemunculan kata</h2>
    <p class="view-description">Bermain dan belajar arti kata yang ada berdasarkan kemunculannya</p>

    <div class="picker-container">
      <div class="picker-wrapper">
        <!-- Filter & Actions Section -->
        <div class="filter-container">
          <div class="filter-row">
            <!-- Select Box (Universal) -->
            <div class="select-pill">
              <select v-model="activeFilterId" class="filter-select">
                <option v-for="filter in filters" :key="filter.id" :value="filter.id">
                  {{ filter.label }}
                </option>
              </select>
              <span class="select-arrow">▼</span>
            </div>

            <!-- Play Button -->
            <button class="btn-play-tier" @click="playTier" v-if="activeFilterId !== 'all'">
               ▶ Latihan soal
            </button>
          </div>
          
          <p class="group-info" v-if="!loading">Terdapat {{ filteredWords.length }} kata yang sesuai dengan kriteria ini</p>
        </div>

        <!-- Word List -->
        <div class="surah-list" v-if="paginatedWords.length > 0">
          <div
            v-for="word in paginatedWords"
            :key="word.text"
            class="surah-link"
          >
            <div class="surah-card clickable" @click="$router.push({ path: `/word-occurrences/${word.text}`, query: { group: activeFilterId } })">
              <div class="card-left">
                <span class="surah-index">{{ word.count }}x</span>
              </div>
              <h2 class="arabic-name">{{ word.text }}</h2>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p v-if="loading">Memuat data...</p>
          <p v-else>Tidak ada kata yang cocok</p>
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
  name: "WordFrequencyGroupsView",
  data() {
    return {
      allWords: [],
      activeFilterId: "100",
      loading: true,
      currentPage: 1,
      pageSize: 100,
      filters: [
        { id: '100', label: 'Kata yang muncul > 100x', min: 101, max: Infinity },
        { id: '50', label: 'Kata yang muncul 51-100x', min: 51, max: 100 },
        { id: '10', label: 'Kata yang muncul 11-50x', min: 11, max: 50 },
        { id: '5', label: 'Kata yang muncul 6-10x', min: 6, max: 10 },
        { id: 'rare', label: 'Kata yang muncul <= 5x', min: 0, max: 5 },
        { id: 'all', label: 'Semua', min: 0, max: Infinity }
      ]
    };
  },
  computed: {
    filteredWords() {
      const activeFilter = this.filters.find(f => f.id === this.activeFilterId);
      let results = this.allWords;

      // Apply frequency filter (range-based)
      if (activeFilter && this.activeFilterId !== 'all') {
        results = results.filter(w => w.count >= activeFilter.min && w.count <= activeFilter.max);
      }

      return results;
    },
    totalPages() {
      return Math.ceil(this.filteredWords.length / this.pageSize);
    },
    paginatedWords() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredWords.slice(start, end);
    }
  },
  watch: {
    activeFilterId() {
      this.currentPage = 1;
    }
  },
  methods: {
    async fetchWordFrequency() {
      this.loading = true;
      try {
        const response = await fetch('/data/word_frequency.json');
        this.allWords = await response.json();
      } catch (error) {
        console.error("Error fetching word frequency:", error);
      } finally {
        this.loading = false;
      }
    },
    playTier() {
      if (this.activeFilterId) {
        this.$router.push(`/play/tier/${this.activeFilterId}`);
      }
    }
  },
  mounted() {
    this.fetchWordFrequency();
  }
};
</script>

<style scoped>
.immersive-picker-view {
  width: 100%;
  min-height: 100%;
  padding-bottom: var(--spacing-xl);
}

.view-title {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

@media (max-width: 480px) {
  .view-title {
    font-size: 1rem;
  }
}

.view-description {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 20px auto;
  line-height: 1.5;
  padding: 0 var(--spacing-md);
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

/* Filter & Actions Container */
.filter-container {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: var(--bg);
  padding: 10px 0 20px 0;
  margin-bottom: 10px;
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.select-pill {
  position: relative;
  background: var(--card-white);
  border: 1px solid var(--stone);
  border-radius: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-right: 15px;
  box-shadow: var(--shadow-sm);
  flex: 1;
}

.filter-select {
  appearance: none;
  -webkit-appearance: none;
  border: none;
  background: transparent;
  width: 100%;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--text-primary);
  outline: none;
  cursor: pointer;
}

.select-arrow {
  font-size: 0.7rem;
  color: var(--text-secondary);
  pointer-events: none;
  position: absolute;
  right: 15px;
}

.btn-play-tier {
  background: var(--coffee);
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  box-shadow: 0 4px 15px rgba(109, 76, 65, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.btn-play-tier {
  background: var(--coffee);
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  box-shadow: 0 4px 15px rgba(109, 76, 65, 0.4);
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-play-tier:hover {
  background: var(--text-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-play-tier:active {
  transform: translateY(0);
}

.group-info {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 15px;
  font-style: italic;
  text-align: center;
}

/* List & Cards */
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

.surah-link {
  text-decoration: none;
  color: inherit;
  display: block;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  font-family: inherit;
}

.surah-card:hover {
  border-color: var(--coffee);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.surah-card.clickable {
  cursor: pointer;
}

.surah-card.clickable:active {
  transform: scale(0.98);
}

.card-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.surah-index {
  font-size: 0.75rem;
  color: var(--coffee);
  font-weight: 700;
}

.english-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.arabic-name {
  font-family: var(--font-family-arabic);
  font-size: 1.8rem;
  color: var(--text-primary);
  margin: 0;
  font-weight: 400;
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
  border-color: var(--coffee);
  color: var(--coffee);
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
</style>
