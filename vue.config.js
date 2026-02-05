module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  transpileDependencies: true,
  pwa: {
    name: "kosakataQ",
    themeColor: "#6D4C41",
    msTileColor: "#6D4C41",
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
    },
    icons: {
      faviconSVG: "img/icons/android-launchericon-152-152.svg",
      favicon16: "img/icons/android-launchericon-16-16.png",
      favicon32: "img/icons/android-launchericon-32-32.png",
      favicon48: "img/icons/android-launchericon-48-48.png",
      favicon72: "img/icons/android-launchericon-72-72.png",
      favicon96: "img/icons/android-launchericon-96-96.png",
      favicon144: "img/icons/android-launchericon-144-144.png",
      appleTouchIcon: "img/icons/apple-touch-icon-152x152.png",
      maskIcon: "img/icons/safari-pinned-tab.svg",
      msTileImage: "img/icons/android-launchericon-144-144.png",
    },
  },
};
