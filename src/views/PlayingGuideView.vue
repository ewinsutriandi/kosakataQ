<template>
  <div class="container text-view">

    <div class="card text-card">
      <h2 class="section-title">Petunjuk Bermain</h2>

      <div class="guide-content">
        <p>
          Mulai dengan memilih salah satu surat pada Al-Quran. Anda dapat
          melihat daftar surat pendek maupun lengkap dengan memilih pada menu.
        </p>
        <p>
          Komputer akan menyiapkan soal pilihan ganda dari surat yang anda
          pilih. Setelahnya, anda diminta memilih mode permainan.
        </p>

        <ul class="guide-list">
          <li>
            <strong>Mode normal:</strong> Urutan ayat tidak diacak, kata yang
            ditanyakan diambil secara acak namun sesuai urutan ayat pada surat.
          </li>
          <li>
            <strong>Mode menantang:</strong> Urutan ayat diacak, kata yang
            ditanyakan akan secara acak dari seluruh ayat pada surat.
          </li>
        </ul>

        <p>
          Saat bermain, anda akan disajikan sebuah ayat al-quran, dan salah satu
          kata dari ayat tersebut. Pilihlah arti kata yang benar. Skor akan
          bertambah jika anda menjawab benar. Pertambahan skor sesuai jumlah
          huruf pada kata yang ditanyakan.
        </p>

        <p class="guide-footer">SELAMAT BERMAIN</p>
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
  margin-bottom: var(--spacing-lg);
}

.guide-content p {
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  font-size: 0.875rem;
  line-height: 1.6;
}

.guide-list {
  list-style: disc;
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  font-size: 0.875rem;
}

.guide-list li {
  margin-bottom: var(--spacing-sm);
}

.guide-footer {
  text-align: center;
  font-weight: 600;
  color: var(--color-primary);
  margin-top: var(--spacing-lg);
}
</style>
<script>
export default {
  name: "PlayingGuideView",
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
};
</script>
