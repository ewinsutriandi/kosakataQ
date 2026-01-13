import Vue from "vue";

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
Vue.use(VueToast);

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/main.css";

import "./registerServiceWorker";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
