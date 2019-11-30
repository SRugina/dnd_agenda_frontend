const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [new CompressionPlugin()]
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "service-worker.js",
      importWorkboxFrom: "local"
    }
  }
};
