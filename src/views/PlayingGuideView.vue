<template>
  <div
    class="max-w-xl bg-white px-9 p-16 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:rounded-xl sm:px-11"
  >
    <h2 class="text-sm text-gray-400">Petunjuk Bermain</h2>
    <div class="text-gray-600 text-sm mb-2">
      <span class="text-blue-400 text-lg">kosakata</span>
      <span class="font-semibold text-blue-500 text-xl">Q</span>
    </div>
    <p class="text-gray-800 m-2">
      Mulai dengan memilih salah satu surat pada Al-Quran. Anda dapat melihat
      daftar surat pendek maupun lengkap dengan memilih pada menu.
    </p>
    <p class="text-gray-800 m-2">
      Komputer akan menyiapkan soal pilihan ganda dari surat yang anda pilih.
      Setelahnya, anda diminta memilih mode permainan.
    </p>
    <span class="text-gray-800 mb-2">
      <ul>
        <li>
          <b>Mode normal:</b> Urutan ayat tidak diacak, kata yang ditanyakan
          diambil secara acak namun sesuai urutan ayat pada surat.
        </li>
        <li>
          <b>Mode menantang:</b> Urutan ayat diacak, kata yang ditanyakan akan
          secara acak dari seluruh ayat pada surat.
        </li>
      </ul>
    </span>
    <p class="text-gray-800 m-2">
      Saat bermain, anda akan disajikan sebuah ayat al-quran, dan salah satu
      kata dari ayat tersebut. Pilihlah arti kata yang benar. Skor akan
      bertambah jika anda menjawab benar. Pertambahan skor sesuai jumlah huruf
      pada kata yang ditanyakan.
    </p>
    <p class="text-gray-800 m-2">SELAMAT BERMAIN</p>
  </div>
</template>
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
