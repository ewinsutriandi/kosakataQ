<template>
  <div class="container text-view">

    <div class="card text-card">
      <h2 class="section-title">Credits</h2>
      <div class="credits-content">
        <ol class="credits-list">
          <li class="credit-item">
            <strong>Assets:</strong> Teks al-qur'an dan penggalan kata diambil
            dari repository Radhi Fadhlillah pada
            <a
              href="https://github.com/tezcane/data-quran"
              target="_blank"
              class="text-link"
              >https://github.com/tezcane/data-quran</a
            >. Sumber asli sebagian besar dari tanzil.net. Keterangan detail
            mengenai asal masing-masing teks dapat dilihat di sana.
          </li>
          <li class="credit-item">
            <strong>Font:</strong> Font yang digunakan untuk menampilkan ayat
            dan penggalan kata adalah <strong>me_quran</strong> (rekomendasi
            dari
            <a href="https://tanzil.net" target="_blank" class="text-link"
              >tanzil.net</a
            >), sumber asli dari arabic font wikispace (nonaktif), salinan
            diambil dari <strong>fontsgeek</strong>.
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-view {
  padding-top: var(--spacing-lg);
  padding-bottom: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-card {
  width: 100%;
  max-width: 600px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.credits-list {
  list-style: decimal;
  padding-left: var(--spacing-lg);
  color: var(--color-text);
  font-size: 0.875rem;
}

.credit-item {
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.text-link {
  color: var(--color-primary);
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}
</style>
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
