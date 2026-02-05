<template>
  <div class="immersive-picker-view">
    <h2 class="view-title">Mode Level</h2>
    <p class="view-description">Bermain dan belajar bertahap level demi level. Setiap level berisi 50 kata yang diurutkan berdasarkan kemunculannya</p>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat level...</p>
    </div>

    <div v-else class="picker-container">
      <div class="levels-grid">
        <router-link 
          v-for="level in paginatedLevels" 
          :key="level" 
          :to="'/level/' + level"
          class="level-card"
        >
          <span class="level-number">{{ level }}</span>
        </router-link>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          Sebelumnya
        </button>
        <span class="page-info">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          Berikutnya
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LevelSelectionView",
  data() {
    return {
      totalWords: 0,
      wordsPerLevel: 50,
      currentPage: 1,
      levelsPerPage: 24,
      loading: true
    };
  },
  computed: {
    totalLevels() {
      return Math.ceil(this.totalWords / this.wordsPerLevel);
    },
    totalPages() {
      return Math.ceil(this.totalLevels / this.levelsPerPage);
    },
    paginatedLevels() {
      const start = (this.currentPage - 1) * this.levelsPerPage;
      const end = start + this.levelsPerPage;
      const levels = [];
      for (let i = start + 1; i <= Math.min(end, this.totalLevels); i++) {
        levels.push(i);
      }
      return levels;
    }
  },
  methods: {
    async fetchWordFrequency() {
      try {
        const response = await fetch('/data/word_frequency.json');
        const data = await response.json();
        this.totalWords = data.length;
      } catch (error) {
        console.error("Error fetching word frequency:", error);
      } finally {
        this.loading = false;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        window.scrollTo(0, 0);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        window.scrollTo(0, 0);
      }
    }
  },
  mounted() {
    this.fetchWordFrequency();
  }
};
</script>

<style scoped>
/* Page-specific styles */
.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: 40px;
}

.level-card {
  aspect-ratio: 1;
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-amount));
  border: 1px solid var(--surface-glass-border);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.level-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--coffee);
}

.level-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.level-card:hover .level-number {
  color: var(--coffee);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-top: 40px;
}

.page-btn {
  background: white;
  border: 1px solid var(--stone);
  padding: 8px 20px;
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--coffee);
  color: var(--coffee);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 600;
}

@media (max-width: 600px) {
  .levels-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: var(--spacing-sm);
  }
  
  .level-number {
    font-size: 1.2rem;
  }
  
  .page-btn {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>
