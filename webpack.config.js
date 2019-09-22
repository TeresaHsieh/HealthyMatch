/* eslint-disable */

const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  devServer: {
    contentBase: "./dist"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{ loader: "file-loader", options: { emitFile: false } }]
      },
      // { test: /\.(png|jpe?g|gif|svg)$/i, use: [{ loader: "file-loader" }] },
      {
        test: /\.svg/,
        use: ["raw-loader"]
      }
    ]
  }
};
