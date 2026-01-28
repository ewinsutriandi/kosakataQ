<template>
  <div class="picker-wrapper">
    <!-- Search & Filter Section -->
    <div class="search-container">
      <div class="search-pill">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari Surat..."
          class="search-input"
        />
      </div>

      <div class="filter-bar">
        <button
          class="filter-chip"
          :class="{ active: tipe === 'j30' }"
          @click="toggleFilter('j30')"
        >
          Juz 30 & Al-Fatihah
        </button>
        <button
          class="filter-chip"
          :class="{ active: tipe === 'all' }"
          @click="toggleFilter('all')"
        >
          Semua Surat
        </button>
      </div>
    </div>

    <!-- Surah List -->
    <div class="surah-list" v-if="filteredList.length > 0">
      <router-link
        v-for="surah in filteredList"
        :key="surah.idx"
        :to="'/play/' + surah.idx"
        class="surah-link"
      >
        <button class="surah-card">
          <div class="card-left">
            <span class="surah-index">{{ formatIndex(surah.idx) }}</span>
            <span class="english-name">{{
              surah.tr_id ? surah.tr_id.nama : surah.name
            }}</span>
          </div>
          <h2 class="arabic-name">{{ surah.name }}</h2>
        </button>
      </router-link>
    </div>

    <div v-else class="empty-state">
      <p>Tidak ada surat yang cocok dengan "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SurahPicker",
  props: ["tipe"],
  data() {
    return {
      surah_list: [],
      searchQuery: "",
    };
  },
  computed: {
    filteredList() {
      if (!this.searchQuery) return this.surah_list;

      const query = this.searchQuery.toLowerCase();
      return this.surah_list.filter((surah) => {
        const english = surah.tr_id?.nama?.toLowerCase() || "";
        const arabic = surah.name || "";
        const idx = surah.idx.toString();

        return (
          english.includes(query) ||
          arabic.includes(query) ||
          idx.includes(query)
        );
      });
    },
  },
  methods: {
    formatIndex(idx) {
      return idx.toString().padStart(2, "0");
    },
    toggleFilter(newType) {
      if (this.tipe !== newType) {
        this.$router.push(`/picksurah/${newType}`);
      }
    },
    generate_surah_list() {
      if (this.tipe === "all") {
        let surahs = this.$store.getters.surahs_all;
        let surah_list = [];
        for (let i = 1; i <= 114; i++) {
          let surah = surahs[i.toString()];
          surah.idx = i;
          surah_list.push(surah);
        }
        this.surah_list = surah_list;
      } else {
        let surahs = this.$store.getters.surahs_j30_plus_fatiha;
        // Convert object to array for sorting/display
        // Get keys and map

        // For J30, we often want Fatihah first, then 78-114
        // The getter might return them in a specific way, but Object.keys order isn't guaranteed.
        // Let's enforce the order: 1, then 78 to 114.
        let list = [];

        if (surahs["1"]) {
          let s1 = surahs["1"];
          s1.idx = 1;
          list.push(s1);
        }

        for (let i = 114; i >= 78; i--) {
          if (surahs[i.toString()]) {
            let s = surahs[i.toString()];
            s.idx = i;
            list.push(s);
          }
        }
        this.surah_list = list;
      }
    },
  },
  watch: {
    tipe() {
      this.generate_surah_list();
    },
  },
  mounted() {
    this.generate_surah_list();
  },
};
</script>

<style scoped>
.picker-wrapper {
  padding-bottom: 2rem;
}

/* Search Container */
.search-container {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: var(
    --bg
  ); /* Matches body bg to cover content when scrolling */
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
  padding-bottom: 5px; /* Scrollbar space */
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
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  font-family: inherit;
}

.surah-card:hover {
  border-color: var(--sage);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.surah-card:active {
  transform: scale(0.98);
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
</style>
