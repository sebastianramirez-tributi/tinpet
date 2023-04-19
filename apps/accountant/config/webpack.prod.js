const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { GenerateSW } = require('workbox-webpack-plugin')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

const common = require('./webpack.common.js')

const PROD_ENV_FILE = path.join(process.cwd(), '/config/environments/.env.prod')
const ENABLE_BUNDLE_ANALYZER = process.env.ENABLE_ANALYZER === 'true'
const { ENV_FILE = PROD_ENV_FILE } = process.env
const dotenv = require('dotenv').config({ path: ENV_FILE })

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      // name: true,
      name: false,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
    runtimeChunk: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...dotenv.parsed,
        APP_VERSION: process.env.APP_VERSION,
      }),
    }),
    new CssMinimizerPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[hash:8].css',
      chunkFilename: 'static/css/[name].[hash:8].css',
    }),

    new CleanWebpackPlugin({
      root: process.cwd(),
      verbose: false,
      dry: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/images', to: 'images' },
        { from: 'public/assets', to: 'assets' },
      ],
    }),
    new WebpackManifestPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: ENABLE_BUNDLE_ANALYZER === true ? 'static' : 'disabled',
      openAnalyzer: true,
    }),
    new GenerateSW({
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/
      //  create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackAllowlist: [/^(?!\/__).*/, /\/[^/]+\.[^/]+$/],
      // Don’t precache sourcemaps (they’re large) and build
      // asset manifest:
      exclude: [/\.map$/, /asset-manifest\.json$/, /index\.html/],
      runtimeCaching: [
        {
          urlPattern: /\/index\.html/,
          handler: 'NetworkFirst',
          options: {
            networkTimeoutSeconds: 5,
          },
        },
      ],
      skipWaiting: true,
    }),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
    new SentryWebpackPlugin({
      org: process.env.SENTRY_ORG_SLUG,
      project: process.env.SENTRY_PROJECT,

      // Specify the directory containing build artifacts
      include: path.resolve(process.cwd(), 'build'),
      dryRun: process.env.HIGHLIGHT_ENVIRONMENT !== 'production',

      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and needs the `project:releases` and `org:read` scopes
      authToken: process.env.SENTRY_AUTH_TOKEN,

      // Optionally uncomment the line below to override automatic release name detection
      release: process.env.APP_VERSION,
    }),
  ],
})
