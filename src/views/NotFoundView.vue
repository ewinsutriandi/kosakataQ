<template>
  <div class="container not-found-view">
    <div class="not-found-content">
      <h1 class="not-found-title">
        Ooops.... Halaman yang anda cari tidak tersedia
      </h1>
      <router-link to="/" class="home-link"
        >Kembali ke halaman utama</router-link
      >
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  text-align: center;
  padding: var(--spacing-xl);
}

.not-found-title {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.home-link {
  color: var(--color-primary);
  text-decoration: underline;
  font-size: 0.875rem;
}

.home-link:hover {
  color: var(--color-text-muted);
}
</style>
<script>
export default {
  name: "NotFoundView",
};
</script>
