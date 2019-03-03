const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
     filename: "./index.html"
});

const copyWebpackPlugin = new CopyWebpackPlugin([{
    from: './src/assets/', 
    to: './assets/' }], 
    { copyUnmodified: false }
);

module.exports = {
  output: {
    path: __dirname + '/docs'
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
           {
             loader: 'image-webpack-loader',
               options: {
                 bypassOnDebug: true, // webpack@1.x
                 disable: true, // webpack@2.x and newer
               },
           },
        ],
      }
    ]
  },
  plugins: [htmlWebpackPlugin, copyWebpackPlugin, new Dotenv()]
};