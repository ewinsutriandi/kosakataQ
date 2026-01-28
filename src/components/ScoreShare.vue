<template>
  <div class="flex justify-center mb-3">
    <a href="#" @click="shareViaWebShare">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#aaa"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
    </a>
  </div>
</template>
<script>
export default {
  name: "ScoreShare",
  props: ["scoreData"],
  data() {
    return {};
  },
  methods: {
    async shareViaWebShare() {
      let titleSuffix = "";
      if (this.scoreData.mode === 'tier' || !this.scoreData.surahIdx) {
        titleSuffix = `Grup ${this.scoreData.tierLabel || ''}`;
      } else {
        let surah = this.$store.getters.surahs_all[this.scoreData.surahIdx];
        titleSuffix = `surat ${surah.name} - ${surah.tr_id.nama}`;
      }

      let text = `Saya `;
      if (this.scoreData.playerWon) {
        text += `berhasil `;
      } else {
        text += `gagal `;
      }
      text += `Menyelesaikan game kosakataQ | `;
      text += `Arti kata pada ${titleSuffix}\n\n`;
      text += `Skor saya ${this.scoreData.score} dari ${this.scoreData.maxScore}\n`;
      text += `Jawaban benar ${this.scoreData.correct}, salah ${this.scoreData.fail}\n\n`;
      
      try {
        await navigator.share({
          title: "kosakataQ",
          text: text,
          url: "https://kosakataQ.web.app",
        });
      } catch (err) {
        // User cancelled or share failed, handle gracefully
        console.log("Share cancelled or failed:", err.message);
      }
    },
  },
  mounted() {
    // console.log("num, fail", this.num, this.fail);
  },
};
</script>
