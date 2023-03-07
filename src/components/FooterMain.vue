<template>
  <footer
    class="p-6 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6"
  >
    <div class="flex justify-center">
      <a href="#" class="flex items-center py-2 mx-2">
        <span class="text-blue-400 text-md">kosakata</span>
        <span class="font-semibold text-blue-500 text-md">Q</span>
      </a>
      <span class="py-4 text-sm">by</span>
      <a
        href="https://play.alza.web.id"
        class="pt-4 hover:underline px-1 text-sm"
        target="_blank"
        >Alza Interactive</a
      >
    </div>
    <ul
      class="flex flex-wrap ml-1 mt-0 sm:ml-0 justify-center items-center mt-3 text-sm text-gray-400"
    >
      <li>
        <a
          href="https://github.com/ewinsutriandi/kosakataQ"
          class="mr-4 hover:underline md:mr-6"
          target="_blank"
          >Source Code</a
        >
      </li>
      <li>
        <router-link to="/credits" class="mr-4 hover:underline md:mr-6"
          >Credits</router-link
        >
      </li>
      <li>
        <router-link to="/license" class="hover:underline md:mr-6"
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
