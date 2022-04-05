const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: "ts-shader-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Game engine",
      favicon: "./public/favicon.ico",
      hash: true,
      template: "./public/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "./src/shaders", to: "./shaders" }],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    client: {
      overlay: { errors: true, warnings: false },
      progress: true,
    },
    compress: true,
    port: 9000,
  },
};
