const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  devServer: {
    disableHostCheck: true
  },
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
