const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    popup: {
      entry: "src/popup/main.ts",
      template: "src/popup/index.html",
      filename: "popup.html",
    },
  },
  configureWebpack: {
    entry: {
      background: "./src/background/background.ts",
      content: "./src/content/content.ts",
    },
    output: {
      filename: "js/[name].js",
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: "src/manifest.json",
          to: "manifest.json",
          transform(content) {
            if (isDev) {
              // 开发环境，注入插件刷新hot-reload.js
              let manifest = JSON.parse(content.toString());
              if (manifest.background && manifest.background.scripts) {
                manifest.background.scripts.unshift("hot-reload.js");
              }
              return JSON.stringify(manifest);
            } else {
              return content;
            }
          },
        },
        {
          from: "src/img/",
          to: `img/`,
        },
        isDev
          ? {
              from: "src/utils/hot-reload.js",
              to: path.resolve("dist"),
            }
          : {},
      ]),
    ],
  },
  css: {
    extract: {
      filename: "css/[name].css",
      // chunkFilename: 'css/[name].css'
    },
    loaderOptions: {
      sass: {},
    },
  },
});
