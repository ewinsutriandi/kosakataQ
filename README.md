# kosakataQ

Sebuah web interaktif yang dirancang untuk membantu mempelajari dan menghafal kosakata Al-Qur'an melalui pendekatan gamifikasi. Belajar arti kata per kata menjadi lebih menyenangkan, terstruktur, dan **immersif**.

## Fitur Utama

### Mode Pembelajaran
- **Mode Surat**: Pilih surat favorit dan pelajari kosakata di dalamnya ayat demi ayat.
- **Mode Level**: Belajar bertingkat dengan ratusan level. Setiap level berisi 50 kata yang diurutkan berdasarkan frekuensi kemunculannya di dalam Al-Qur'an (dari yang paling sering).

### Mode Khusus
- **Koleksi Ayat Pilihan**: Berisi "playlist" yang dapat dibuat sendiri untuk mempelajari arti kata dari ayat tertentu, misalnya Ayat Kursi atau Doa Nabi Musa
- **Belajar dari Kesalahan**: Aplikasi merekam kesalahan ada jawaban yang salah, memudahkan untuk mengulang kembali kata-kata yang belum dihafal artinya.


### Kemudahan Akses
- **PWA Ready**: Aplikasi dapat diinstall langsung di smartphone/dekstop tanpa perlu melalui PlayStore/AppStore.
- **Offline First**: Menggunakan sistem caching data(LocalForage & IndexedDB) untuk menyimpan data yang dibutuhkan pada perangkat anda saat pertama kali diakses, sehingga dapat digunakan kembali tanpa koneksi internet.

## Teknologi & Stack

Aplikasi ini dibangun dengan dukungan teknologi berikut:
- **Core Framework**: Vue.js 2
- **State Management**: Vuex (Global Store)
- **Data Persistence**: LocalForage (IndexedDB) & LocalStorage
- **Design System**: Vanilla CSS: Glassmorphism & Nature-inspired palette.
- **Dataset**: Meta-data lengkap dari 114 surat dan 6,236 ayat Al-Qur'an.

## Persiapan Pengembangan (Local Setup)

1. **Clone project**
   ```bash
   git clone https://github.com/ewinsutriandi/kosakataQ
   ```

2. **Install dependensi**
   ```bash
   npm install
   ```

3. **Jalankan Aplikasi**
   ```bash
   npm run serve
   ```

## Demo & Hosting

Aplikasi ini dapat diakses secara gratis di:  
[https://kosakataQ.web.app](https://kosakataQ.web.app)

---
*Sejak versi 2.0 aplikasi ini dibuat dengan dukungan penuh agentic AI*
