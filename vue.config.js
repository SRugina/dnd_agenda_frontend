const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
module.exports = {
  devServer: {
    proxy: "http://localhost:8000/api/v1/"
  },
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()]
  }
};
