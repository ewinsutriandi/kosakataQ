<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-6xl mx-auto px-3">
      <div class="flex justify-between">
        <div class="flex-auto md:flex space-x-1 ml-6">
          <!-- Area untuk nama/logo app -->
          <div class="flex justify-center">
            <router-link to="/" class="flex items-center px-2">
              <span class="text-blue-400 text-2xl">kosakata</span>
              <span class="font-semibold text-blue-500 text-3xl">Q</span>
            </router-link>
          </div>
          <!-- Area untuk deskripsi app -->
          <div class="md:flex items-center px-2 mt-2">
            <span class="text-gray-600 text-sm">
              Bermain dan belajar arti kata ayat-ayat al Qur'an
            </span>
          </div>
        </div>
        <!-- Area untuk menu kanan -->
        <div class="md:flex items-center space-x-3 py-4">
          <button
            @click="toggle_menu_vis"
            class="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white"
          >
            <svg
              class="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
        </div>
        <div
          v-show="!hide_menu"
          class="absolute right-14 xl:right-80 top-16 z-10 mt-3 w-48 max-w-xs overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5"
        >
          <header-popup @menuClicked="toggle_menu_vis" />
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import HeaderPopup from "@/components/HeaderPopup.vue";
export default {
  name: "HeaderMain",
  components: { HeaderPopup },
  data() {
    return {
      hide_menu: true,
    };
  },
  methods: {
    toggle_menu_vis() {
      //console.log("toggle header menu");
      this.hide_menu = !this.hide_menu;
    },
  },
};
</script>
