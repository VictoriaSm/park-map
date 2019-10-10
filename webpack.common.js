const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: {
    gx: './src/app/index.tsx'
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    new HtmlWebpackPlugin({
      template: './src/app/index.html'
    }),
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/,
      /scss\.d\.ts$/
    ]),
    new ForkTsCheckerWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      },      
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images/'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              //name: '[path][name].[ext]',
              outputPath: 'fonts/'
            }
          }        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
  }
};