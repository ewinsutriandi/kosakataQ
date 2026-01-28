<template>
  <div class="immersive-picker-view">
    <header class="main-header">
      <h1>kosakataQ</h1>
      <p class="subtitle">Bermain dan belajar arti kata ayat-ayat al Qur'an</p>
    </header>
    <h2 class="view-title">Belajar Surat demi Surat</h2>
    <p class="view-description">Pilih surat di bawah ini untuk memulai latihan menghafal kosakata ayat-ayat Al-Qur'an.</p>
    <div class="picker-container">
      <surah-picker :tipe="this.$route.params.tipe" />
    </div>
  </div>
</template>
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
</style>
<script>
import SurahPicker from "@/components/SurahPicker.vue";

export default {
  name: "SuraPickerView",
  components: { SurahPicker },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
};
</script>
