const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const BuildDirectoryPath = path.join(__dirname, "./dist");

module.exports = {
  entry: {
    indexPage: ["./src/index.js"],
    secondPage: "./src/secondPage.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      title: "Webpack Management",
      chunks: ["indexPage"],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      inject: true,
      title: "second page title",
      chunks: ["secondPage"],
      filename: path.join(BuildDirectoryPath, "/second/index.html"),
    }),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: BuildDirectoryPath,
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
};
