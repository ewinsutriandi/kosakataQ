<template>
  <div
    class="bg-white px-9 pt-8 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:rounded-xl sm:px-11"
  >
    <h2
      class="ml-3 mb-2 text-sm text-left font-bold leading-7 text-gray-400 sm:truncate"
    >
      Pilih surat untuk memulai
    </h2>
    <surah-picker :tipe="this.$route.params.tipe" />
  </div>
</template>
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
