<template>
  <div class="heart-container" v-if="num">
    <div class="heart-item" v-for="index in parseInt(num)" :key="index">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        :fill="color_code(index)"
        :stroke="color_code(index)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        ></path>
      </svg>
      <span class="sr-only">life indicator...</span>
    </div>
  </div>
</template>

<style scoped>
.heart-container {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.heart-item {
  display: flex;
}
</style>
<script>
export default {
  name: "HeartIndicator",
  props: ["num", "fail"],
  data() {
    return {
      color: "#aaa",
      fill: "none",
    };
  },
  methods: {
    color_code(index) {
      // console.log("col: num, fail", this.num, this.fail);
      let life = this.num - this.fail;
      // console.log("index,life", index, life);
      if (index <= life) {
        return "#830E07";
      }
      return "#aaa";
    },
  },
  mounted() {
    if (this.tipe === "life") {
      this.color = "#830E0800";
      this.fill = "#830E07";
    }
    // console.log("num, fail", this.num, this.fail);
  },
};
</script>
