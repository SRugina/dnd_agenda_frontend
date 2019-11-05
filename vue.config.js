const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
module.exports = {
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()]
  }
};
