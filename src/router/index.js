import Vue from "vue";
import VueRouter from "vue-router";
//import HomeView from "../views/HomeView.vue";
import SurahPickerView from "../views/SurahPickerView.vue";
import GameScreenView from "../views/GameScreenView.vue";
import LicenseView from "../views/LicenseView.vue";
import PlayingGuideView from "../views/PlayingGuideView.vue";
import CreditView from "../views/CreditView.vue";
import GameStatisticsView from "../views/GameStatisticsView.vue";
import NotFoundView from "../views/NotFoundView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/picksurah/j30",
  },
  {
    path: "/picksurah/:tipe",
    name: "picksurah",
    component: SurahPickerView,
  },
  {
    path: "/play/:idx",
    name: "gamescreen",
    component: GameScreenView,
  },
  {
    path: "/stats/:tipe",
    name: "gamestats",
    component: GameStatisticsView,
  },
  {
    path: "/license",
    name: "license",
    component: LicenseView,
  },
  {
    path: "/playing-guide",
    name: "playing guide",
    component: PlayingGuideView,
  },
  {
    path: "/credits",
    name: "credits",
    component: CreditView,
  },
  {
    path: "*",
    component: NotFoundView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
