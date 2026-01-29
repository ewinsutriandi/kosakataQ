<template>
  <div class="container text-view">

    <div class="card text-card">
      <h2 class="section-title">Petunjuk Bermain</h2>

      <div class="guide-content">
        <p>
          Selamat datang di <strong>kosakataQ</strong>. Aplikasi ini menyediakan dua cara menyenangkan untuk mempelajari kosakata Al-Qur'an:
        </p>

        <h3 class="guide-subtitle">1. Kosakata surat</h3>
        <p>
          Bermain dan belajar arti kata yang muncul pada surat tertentu. Cocok untuk Anda yang sedang menghafal surat per surat.
        </p>
        <ul class="guide-list">
          <li>Pilih surat yang ingin dipelajari dari daftar.</li>
          <li>
            <strong>Mode normal:</strong> Urutan ayat runut, kata yang ditanyakan diambil acak sesuai urutan ayat.
          </li>
          <li>
            <strong>Mode menantang:</strong> Urutan ayat diacak, kata yang ditanyakan diambil acak dari seluruh surat.
          </li>
        </ul>

        <h3 class="guide-subtitle">2. Kemunculan kata</h3>
        <p>
          Bermain dan belajar arti kata berdasarkan seberapa sering kata tersebut muncul dalam Al-Qur'an.
        </p>
        <ul class="guide-list">
          <li>Gunakan filter untuk memilih kelompok kata (contoh: Kata yang muncul > 100x).</li>
          <li>Klik "Latihan soal" untuk memulai sesi permainan pada kelompok kata tersebut.</li>
        </ul>

        <h3 class="guide-subtitle">Cara Bermain</h3>
        <p>
          Dalam permainan, Anda akan disajikan potongan ayat Al-Qur'an dengan satu kata yang ditandai. Tugas Anda adalah memilih arti yang tepat untuk kata tersebut.
        </p>
        <p>
          Skor akan bertambah jika Anda menjawab benar, dengan poin sesuai jumlah huruf pada kata yang ditanyakan.
        </p>

        <p class="guide-footer">SELAMAT BERLAJAR & BERMAIN</p>
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

.guide-subtitle {
  font-size: 1rem;
  font-weight: 700;
  color: var(--sage);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
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
