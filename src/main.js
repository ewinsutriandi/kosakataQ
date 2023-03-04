import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";

import VueTailwind from "vue-tailwind";
import VueTailwindSettings from "./VueTailwindSettings.js";
Vue.use(VueTailwind, VueTailwindSettings);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");