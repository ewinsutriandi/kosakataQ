<template>
  <div
    class="max-w-xl bg-white px-9 p-16 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:rounded-xl sm:px-11"
  >
    <h2 class="ml-3 mb-2 text-sm font-bold leading-7 text-gray-400 sm:truncate">
      Credits
    </h2>
    <span class="text-gray-800 mb-2">
      <ol>
        <li class="mb-2">
          <b>Assets:</b> Teks al-qur'an dan penggalan kata diambil dari
          repository Radhi Fadhlillah pada
          <a
            href="https://github.com/tezcane/data-quran"
            target="_blank"
            class="text-blue-500"
            >https://github.com/tezcane/data-quran</a
          >. Sumber asli sebagian besar dari tanzil.net. Keterangan detail
          mengenai asal masing-masing teks dapat dilihat di sana.
        </li>
        <li>
          <b>Font:</b> Font yang digunakan untuk menampilkan ayat dan penggalan
          kata adalah <b>me_quran</b> (rekomendasi dari
          <a href="https://tanzil.net" target="_blank" class="text-blue-500"
            >tanzil.net</a
          >), sumber asli dari arabic font wikispace (nonaktif), salinan diambil
          dari <b>fontsgeek</b>.
        </li>
      </ol>
    </span>
  </div>
</template>
<script>
export default {
  name: "CreditView",
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
};
</script>
