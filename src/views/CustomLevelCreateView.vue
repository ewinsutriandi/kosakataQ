<template>
  <div class="immersive-picker-view">
    <button class="back-floating-btn" @click="$router.push('/special-modes/custom')">
      ← Batal
    </button>
    
    <h2 class="view-title">Tambah Koleksi Pilihan</h2>
    <p class="view-description">Tentukan nama dan cakupan ayat untuk koleksi hafalan Anda.</p>

    <div class="picker-container">
      <div class="glass-card create-card">
        <form @submit.prevent="saveLevel">
          <div class="form-group">
            <label for="levelName">Nama Level</label>
            <input 
              type="text" 
              id="levelName" 
              v-model="form.name" 
              placeholder="Contoh: Hafalan Surat Al-Mulk"
              required 
            />
          </div>

          <div class="form-group">
            <label for="surah">Pilih Surat</label>
            <select id="surah" v-model="form.surahIdx" @change="onSurahChange" required>
              <option value="" disabled>--- Pilih Surat ---</option>
              <option v-for="surah in surahList" :key="surah.idx" :value="surah.idx">
                {{ surah.idx }}. {{ surah.tr_id.nama }} ({{ surah.name }})
              </option>
            </select>
          </div>

          <div v-if="form.surahIdx" class="range-group">
            <div class="form-group">
              <label for="startAyah">Dari Ayat</label>
              <input 
                type="number" 
                id="startAyah" 
                v-model.number="form.startAyah" 
                min="1" 
                :max="maxAyah" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="endAyah">Sampai Ayat</label>
              <input 
                type="number" 
                id="endAyah" 
                v-model.number="form.endAyah" 
                :min="form.startAyah" 
                :max="maxAyah" 
                required 
              />
            </div>
          </div>
          <p v-if="form.surahIdx" class="ayah-hint">Surat ini memiliki total {{ maxAyah }} ayat.</p>

          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="!isFormValid">
              Simpan Koleksi
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomLevelCreateView",
  data() {
    return {
      form: {
        name: "",
        surahIdx: "",
        startAyah: 1,
        endAyah: 1
      }
    };
  },
  computed: {
    surahList() {
      const surahs = this.$store.getters.surahs_all;
      const list = [];
      for (let i = 1; i <= 114; i++) {
        if (surahs[i.toString()]) {
          list.push({ ...surahs[i.toString()], idx: i });
        }
      }
      return list;
    },
    selectedSurah() {
      if (!this.form.surahIdx) return null;
      return this.$store.state.surahs[this.form.surahIdx.toString()];
    },
    maxAyah() {
      return this.selectedSurah ? parseInt(this.selectedSurah.nAyah) : 1;
    },
    isFormValid() {
      return (
        this.form.name &&
        this.form.surahIdx &&
        this.form.startAyah >= 1 &&
        this.form.endAyah >= this.form.startAyah &&
        this.form.endAyah <= this.maxAyah
      );
    }
  },
  methods: {
    onSurahChange() {
      this.form.startAyah = 1;
      this.form.endAyah = this.maxAyah;
    },
    saveLevel() {
      if (!this.isFormValid) return;
      
      const newLevel = {
        id: Date.now().toString(),
        ...this.form
      };
      
      this.$store.commit("add_custom_level", newLevel);
      this.$router.push("/special-modes/custom");
    }
  }
};
</script>

<style scoped>
.create-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px !important;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.form-group label {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input, select {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--surface-glass-border);
  background: white;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
}

input:focus, select:focus {
  border-color: var(--coffee);
  box-shadow: 0 0 0 3px rgba(109, 76, 65, 0.1);
}

.range-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.ayah-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-top: -10px;
  margin-bottom: 20px;
}

.form-actions {
  margin-top: 30px;
}

.save-btn {
  width: 100%;
  background: var(--coffee);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(109, 76, 65, 0.3);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(109, 76, 65, 0.4);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}
</style>
