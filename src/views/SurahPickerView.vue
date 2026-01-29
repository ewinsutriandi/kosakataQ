<template>
  <div class="immersive-picker-view">
    <h2 class="view-title">Kosakata surat</h2>
    <p class="view-description">Bermain dan belajar arti kata yang muncul pada surat tertentu</p>
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
