<template>
  <div class="immersive-picker-view">
    <button class="back-floating-btn" @click="$router.push('/special-modes')">
      ← Kembali
    </button>
    
    <h2 class="view-title">Koleksi Ayat Pilihan</h2>
    <p class="view-description">Kumpulan ayat-ayat favorit yang kamu pilih sendiri untuk dipelajari.</p>

    <div class="picker-container">
      <div class="actions-header">
        <button @click="$router.push('/special-modes/custom/create')" class="add-btn">
          <span class="icon">+</span> Tambah Koleksi
        </button>
      </div>

      <div class="levels-list">
        <div v-for="level in customLevels" :key="level.id" class="level-card-wrapper">
          <div class="custom-card" @click="handleCardClick(level)">
            <div class="card-info">
              <div class="level-name">
                {{ level.name }}
              </div>
              <div class="level-meta">
                {{ getSurahName(level.surahIdx) }} Ayat {{ level.startAyah }}{{ level.startAyah === level.endAyah ? '' : '-' + level.endAyah }}
              </div>
              <div v-if="hasSession(level.id)" class="resume-text">Ada Sesi Tersimpan</div>
            </div>
            <button @click.stop="confirmDelete(level)" class="delete-icon-btn" title="Hapus">
              ✕
            </button>
          </div>
        </div>

        <div v-if="customLevels.length === 0" class="empty-state">
          <p>Belum ada koleksi ayat. Klik tombol di atas untuk membuat!</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div v-if="levelToDelete" class="modal-overlay">
        <div class="glass-card modal-card">
          <h3 class="modal-title">Hapus Level?</h3>
          <p class="modal-desc">Apakah Anda yakin ingin menghapus level "<b>{{ levelToDelete.name }}</b>"? Tindakan ini tidak dapat dibatalkan.</p>
          <div class="actions-row">
            <button @click="levelToDelete = null" class="btn-glass">Batal</button>
            <button @click="deleteLevel" class="btn-glass btn-danger">Hapus</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "CustomModeHubView",
  data() {
    return {
      levelToDelete: null
    };
  },
  computed: {
    customLevels() {
      return this.$store.state.custom_levels || [];
    }
  },
  methods: {
    hasSession(id) {
      return this.$store.getters.hasSavedSession(`custom_${id}`);
    },
    getSurahName(idx) {
      const surah = this.$store.state.surahs_translit_id[idx];
      return surah ? surah.nama : `Surat ${idx}`;
    },
    handleCardClick(level) {
      if (this.hasSession(level.id)) {
        this.resumeLevel(level);
      } else {
        this.playLevel(level);
      }
    },
    playLevel(level) {
      if (this.hasSession(level.id)) {
        this.$store.commit("clear_session", `custom_${level.id}`);
      }
      this.$router.push(`/play/custom/${level.id}`);
    },
    resumeLevel(level) {
      this.$router.push({
        path: `/play/custom/${level.id}`,
        query: { resume: 'true' }
      });
    },
    confirmDelete(level) {
      this.levelToDelete = level;
    },
    deleteLevel() {
      if (this.levelToDelete) {
        this.$store.commit('delete_custom_level', this.levelToDelete.id);
        this.levelToDelete = null;
      }
    }
  }
};
</script>

<style scoped>
.actions-header {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.add-btn {
  background: var(--coffee);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(109, 76, 65, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(109, 76, 65, 0.4);
}

.levels-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 600px;
  margin: 0 auto;
}

.custom-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface-glass);
  backdrop-filter: blur(var(--blur-amount));
  border: 1px solid var(--surface-glass-border);
  border-radius: var(--radius-lg);
  padding: 20px 25px;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.custom-card:hover {
  border-color: var(--coffee);
  transform: translateX(5px);
}

.card-info {
  flex: 1;
  cursor: pointer;
}

.level-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.level-meta {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.delete-icon-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  padding: 10px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s ease;
}

.delete-icon-btn:hover {
  opacity: 1;
  color: #DC2626;
  transform: scale(1.1);
}

.resume-text {
  display: inline-block;
  font-size: 0.65rem;
  color: var(--coffee);
  font-weight: 800;
  text-transform: uppercase;
  background: rgba(109, 76, 65, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  font-style: italic;
}

/* Modal styles from GameScreenView */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  max-width: 400px;
  width: 100%;
  padding: 30px !important;
  text-align: center;
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.modal-desc {
  margin-bottom: 25px;
  color: var(--text-secondary);
}

.actions-row {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-danger {
  background: rgba(220, 38, 38, 0.1);
  color: #DC2626;
  border-color: rgba(220, 38, 38, 0.2);
}

.btn-danger:hover {
  background: #DC2626 !important;
  color: white !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
