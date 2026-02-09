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
    path: "/surah/:idx",
    name: "surah-detail",
    component: () => import("../views/SurahDetailView.vue"),
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
    path: "/levels",
    name: "levels",
    component: () => import("../views/LevelSelectionView.vue"),
  },
  {
    path: "/level/:levelId",
    name: "level-detail",
    component: () => import("../views/LevelDetailView.vue"),
  },
  {
    path: "/play/level/:levelId",
    name: "gamescreen-level",
    component: GameScreenView,
    meta: { hideNavigation: true }
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

router.beforeEach((to, from, next) => {
  const baseTitle = "kosakataQ";
  let pageTitle = "";

  switch (to.name) {
    case 'home':
      pageTitle = "Belajar Arti Kata Al-Qur'an";
      break;
    case 'picksurah':
      pageTitle = "Pilih Surat";
      break;
    case 'surah-detail':
      pageTitle = `Detail Surat ${to.params.idx}`;
      break;
    case 'levels':
      pageTitle = "Mode Level";
      break;
    case 'level-detail':
      pageTitle = `Level ${to.params.levelId}`;
      break;
    case 'gamestats':
      pageTitle = "Statistik Permainan";
      break;
    case 'wordfrequency':
      pageTitle = "Frekuensi Kata";
      break;
    case 'playing guide':
      pageTitle = "Panduan Bermain";
      break;
    default:
      pageTitle = to.name ? to.name.charAt(0).toUpperCase() + to.name.slice(1) : "";
  }

  document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
  next();
});

export default router;
