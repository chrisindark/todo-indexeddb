const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: [
    './src/index.js',
    './src/index.css',
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
              minimize: true,
              localIdentName: "[name]_[local]_[hash:base64]",
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    new CopyWebpackPlugin([
      { from: './src/index.html', to: './dist' },
      // { from: 'other', to: 'public' },
    ]),
  ],
  devServer: {
    open: false,
    historyApiFallback: true,
    port: 3000,
  },
};
