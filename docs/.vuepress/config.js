const moment = require("moment");

module.exports = {
  base: "/website/",
  title: "Box",
  description: "Easy to build enterprise services with box",
  head: [],
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "指南",
        link: "/guide/description",
      },
    ],
    repo: "boxgo/box",
    repoLabel: "GitHub",
    docsDir: "",
    docsBranch: "master",
    editLinks: true,
    editLinkText: "在github.com上编辑此页",
    sidebar: {
      "/guide/": [
        {
          title: "指南",
          children: [
            "/guide/description",
            "/guide/quickstart",
          ],
        },
        {
          title: "核心模块",
          children: [
            "/guide/boot",
            "/guide/config",
          ],
        },
      ],
    },
    sidebarDepth: 2,
    lastUpdated: "上次更新",
    serviceWorker: {
      updatePopup: {
        message: "发现新内容可用",
        buttonText: "刷新",
      },
    },
  },
  plugins: [
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          const moment = require("moment");
          moment.locale("zh-cn");
          return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
        },

        dateOptions: {
          hours12: true,
        },
      },
    ],
    [
      'vuepress-plugin-baidu-tongji-analytics',
      {
        key: 'f2b62129b09eeaa3592e13ba88fb6f8d'
      },
    ],
    "@vuepress/back-to-top",
    "@vuepress/active-header-links",
    "@vuepress/medium-zoom",
    "@vuepress/nprogress",
  ],
};