<template>
  <div class="flex-grow">
    <h1 class="text-2xl mb-4">
      Ooops.... Halaman yang anda cari tidak tersedia
    </h1>
    <router-link
      to="/"
      class="text-sm text-blue-500 underline hover:text-gray-400"
      >Kembali ke halaman utama</router-link
    >
  </div>
</template>
<script>
export default {
  name: "NotFoundView",
};
</script>
