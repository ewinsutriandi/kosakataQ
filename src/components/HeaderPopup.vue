<template>
  <div class="p-1">
    <div
      class="group relative flex items-center gap-x-1 rounded-lg p-2 text-sm leading-3 hover:bg-gray-50"
    >
      <div
        class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white"
      >
        <svg
          class="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="2" y1="6" x2="4" y2="6"></line>
          <line x1="2" y1="12" x2="4" y2="12"></line>
          <line x1="2" y1="18" x2="4" y2="18"></line>
        </svg>
      </div>
      <div class="flex-auto">
        <router-link
          to="/picksurah/j30"
          @click.native="menu_clicked"
          class="block font-semibold text-gray-500"
        >
          Surat pendek
          <span class="absolute inset-0"></span>
        </router-link>
      </div>
    </div>
    <div
      class="group relative flex items-center gap-x-1 rounded-lg p-2 text-sm leading-3 hover:bg-gray-50"
    >
      <div
        class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white"
      >
        <svg
          class="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="2" y1="6" x2="4" y2="6"></line>
          <line x1="2" y1="12" x2="4" y2="12"></line>
          <line x1="2" y1="18" x2="4" y2="18"></line>
        </svg>
      </div>
      <div class="flex-auto">
        <router-link
          to="/picksurah/all"
          @click.native="menu_clicked"
          class="block font-semibold text-gray-500"
        >
          Semua surat
          <span class="absolute inset-0"></span>
        </router-link>
      </div>
    </div>
    <div
      class="group relative flex items-center gap-x-1 rounded-lg p-2 text-sm leading-3 hover:bg-gray-50"
    >
      <div
        class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white"
      >
        <svg
          class="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="9"></line>
        </svg>
      </div>
      <div class="flex-auto">
        <router-link
          to="/playing-guide"
          @click.native="menu_clicked"
          class="block font-semibold text-gray-500"
        >
          Cara bermain
          <span class="absolute inset-0"></span>
        </router-link>
      </div>
    </div>
    <div
      class="group relative flex items-center gap-x-1 rounded-lg p-2 text-sm leading-3 hover:bg-gray-50"
    >
      <div
        class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white"
      >
        <svg
          class="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M3 3v18h18" />
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
        </svg>
      </div>
      <div class="flex-auto">
        <router-link
          to="/stats/j30"
          @click.native="menu_clicked"
          class="block font-semibold text-gray-500"
        >
          Statistik
          <span class="absolute inset-0"></span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HeaderPopup",
  data() {
    return {};
  },
  methods: {
    menu_clicked() {
      this.$emit("menuClicked");
    },
  },
};
</script>
