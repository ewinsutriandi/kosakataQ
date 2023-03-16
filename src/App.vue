<template>
  <div id="app" class="flex flex-col h-screen justify-between">
    <header-main />
    <div class="min-h-800 relative flex flex-col bg-gray-20 py-6 sm:py-12">
      <router-view :key="$route.fullPath" />
    </div>
    <footer-main />
  </div>
</template>

<script>
import HeaderMain from "@/components/HeaderMain.vue";
import FooterMain from "@/components/FooterMain.vue";
export default {
  components: { HeaderMain, FooterMain },
  beforeMount() {
    this.$store.commit("initializeVars");
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #aaa;
}
</style>
