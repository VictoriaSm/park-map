const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true 
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
            }
          },
          {
            loader: "typings-for-css-modules-loader", //"css-loader",
            options: {
              modules: true,
              namedExport: true,
              sass: true,
              camelCase: true,
              sourceMap: true,
              localIdentName: '[local]',
          }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          },
          { 
            loader: 'sass-loader', 
            options: { 
              sourceMap: true 
            } 
          },
        ]
      }
    ]
  }
});
