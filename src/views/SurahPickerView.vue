<template>
  <div class="immersive-picker-view">
    <h2 class="view-title">Mode Surat</h2>
    <p class="view-description">Bermain dan belajar arti kata yang muncul pada tiap surat. Tersedia dua tingkat kesulitan: normal (ayat terurut), dan menantang (ayat diacak)</p>
    <div class="picker-container">
      <surah-picker :tipe="this.$route.params.tipe" />
    </div>
  </div>
</template>
<style scoped>
/* Scoped styles specific to SurahPickerView if any (Empty for now) */
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
