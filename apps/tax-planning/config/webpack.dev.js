const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const common = require('./webpack.common.js')

const dotenv = require('dotenv').config({
  path: path.join(process.cwd(), '/config/environments/.env.dev'),
})

const MAP_STYLE = process.env.MAP_STYLE === 'true'

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000,
    static: {
      publicPath: '/',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: MAP_STYLE ? 'css-loader?sourceMap' : 'css-loader' },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env': JSON.stringify(dotenv.parsed) }),
  ],
})
