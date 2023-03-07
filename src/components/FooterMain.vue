<template>
  <footer
    class="p-6 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800"
  >
    <div class="flex justify-center">
      <a href="#" class="flex items-center py-2 px-2">
        <span class="text-blue-400 text-md">kosakata</span>
        <span class="font-semibold text-blue-500 text-md">Q</span>
      </a>
      <span class="py-4 text-sm">by</span>
      <a
        href="https://play.alza.web.id"
        class="pt-4 hover:underline px-1 text-sm"
        >Alza Interactive</a
      >
    </div>
    <ul
      class="flex flex-wrap mt-0 justify-center items-center mt-3 text-sm text-gray-400 dark:text-gray-400"
    >
      <li>
        <a
          href="https://github.com/ewinsutriandi/kosakataQ"
          class="mr-4 hover:underline md:mr-6"
          >Source Code</a
        >
      </li>
      <li>
        <router-link to="/license" class="mr-4 hover:underline md:mr-6"
          >License</router-link
        >
      </li>
    </ul>
  </footer>
</template>
<script>
export default {
  name: "FooterMain",
};
</script>
