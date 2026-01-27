<template>
  <div class="immersive-picker-view">
    <header class="main-header">
      <h1>kosakataQ</h1>
      <p class="subtitle">Bermain dan belajar arti kata ayat-ayat al Qur'an</p>
    </header>

    <h2 class="view-title">Daftar Kata</h2>

    <div class="picker-container">
      <div class="picker-wrapper">
        <!-- Search & Filter Section -->
        <div class="search-container">
          <div class="search-pill">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari Kata..."
              class="search-input"
            />
          </div>

          <div class="filter-bar">
            <button
              v-for="filter in filters"
              :key="filter.id"
              class="filter-chip"
              :class="{ active: activeFilterId === filter.id }"
              @click="activeFilterId = filter.id"
            >
              <span class="chip-icon">{{ filter.icon }}</span> {{ filter.label }}
            </button>
          </div>
          <p class="group-info" v-if="!loading">Menampilkan {{ filteredWords.length }} kata</p>
        </div>

        <!-- Word List -->
        <div class="surah-list" v-if="paginatedWords.length > 0">
          <div
            v-for="word in paginatedWords"
            :key="word.text"
            class="surah-link"
          >
            <div class="surah-card">
              <div class="card-left">
                <span class="surah-index">{{ word.count }}x</span>
                <span class="english-name">Kosakata</span>
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
      searchQuery: "",
      activeFilterId: "100",
      loading: true,
      currentPage: 1,
      pageSize: 100,
      filters: [
        { id: '100', label: 'Muncul >100x', min: 101, max: Infinity, icon: '🔥' },
        { id: '50', label: 'Muncul 51-100x', min: 51, max: 100, icon: '✨' },
        { id: '10', label: 'Muncul 11-50x', min: 11, max: 50, icon: '📚' },
        { id: '5', label: 'Muncul 6-10x', min: 6, max: 10, icon: '🔍' },
        { id: 'rare', label: 'Muncul <= 5x', min: 0, max: 5, icon: '❄️' },
        { id: 'all', label: 'Semua', min: 0, max: Infinity, icon: '🌟' }
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

      // Apply search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        results = results.filter(w => w.text.includes(query));
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
    },
    searchQuery() {
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

.main-header {
  text-align: center;
  margin: 30px 0;
}

.main-header h1 {
  font-size: 1.5rem;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 5px;
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

/* Search Container - adapted from SurahPicker */
.search-container {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: var(--bg);
  padding: 10px 0 20px 0;
  margin-bottom: 10px;
}

.search-pill {
  background: var(--card-white);
  border: 1px solid var(--stone);
  border-radius: 50px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.search-pill:focus-within {
  border-color: var(--sage);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.search-icon {
  margin-right: 12px;
  font-size: 1.1rem;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  font-family: var(--font-family-base);
  color: var(--text-primary);
  background: transparent;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  overflow-x: auto;
  padding-bottom: 5px;
  -webkit-overflow-scrolling: touch;
}

.filter-chip {
  background: transparent;
  border: 1px solid var(--stone);
  border-radius: 50px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-family: inherit;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.filter-chip:hover {
  background-color: #efefe8;
  border-color: var(--sage);
}

.filter-chip.active {
  background-color: var(--sage);
  border-color: var(--sage);
  color: white;
  box-shadow: 0 4px 12px rgba(141, 161, 137, 0.3);
  transform: translateY(-1px);
}

.group-info {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 10px;
  font-style: italic;
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
  border-color: var(--sage);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.surah-index {
  font-size: 0.75rem;
  color: var(--sage);
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
</style>
