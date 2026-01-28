import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import SurahPickerView from "../views/SurahPickerView.vue";
import GameScreenView from "../views/GameScreenView.vue";
import LicenseView from "../views/LicenseView.vue";
import PlayingGuideView from "../views/PlayingGuideView.vue";
import CreditView from "../views/CreditView.vue";
import GameStatisticsView from "../views/GameStatisticsView.vue";
import WordFrequencyGroupsView from "../views/WordFrequencyGroupsView.vue";
import WordOccurrencesView from "../views/WordOccurrencesView.vue";
import NotFoundView from "../views/NotFoundView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { hideNavigation: true }
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
    meta: { hideNavigation: true }
  },
  {
    path: "/play/tier/:tierId",
    name: "gamescreen-tier",
    component: GameScreenView,
    meta: { hideNavigation: true }
  },
  {
    path: "/stats/:tipe",
    name: "gamestats",
    component: GameStatisticsView,
  },
  {
    path: "/word-frequency",
    name: "wordfrequency",
    component: WordFrequencyGroupsView,
  },
  {
    path: "/word-occurrences/:word",
    name: "wordoccurrences",
    component: WordOccurrencesView,
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
