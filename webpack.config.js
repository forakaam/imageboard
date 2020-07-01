require('dotenv').config();

const HtmlWebPackPlugin = require("html-webpack-plugin"),
  { CleanWebpackPlugin } = require('clean-webpack-plugin');


const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const cleanWebpackPlugin = new CleanWebpackPlugin({
  cleanOnceBeforeBuildPatterns: ['**/*', '!images/**/**'],
})
module.exports = {
  output: {
    publicPath: process.env.ASSET_PATH,
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },  
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          esModule: false,
          name: '[name].[ext]',
          outputPath: 'images'
        }
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        enforce: 'pre'
      },
    ]
  },
  plugins: [htmlPlugin, cleanWebpackPlugin] 
};