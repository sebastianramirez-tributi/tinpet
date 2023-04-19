const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LocalizeAssetsPlugin = require('webpack-localize-assets-plugin')

module.exports = {
  entry: path.resolve(process.cwd(), 'src', 'index.js'),
  output: {
    filename: 'static/js/[name].[hash:8].js',
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  },
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: path.resolve(process.cwd(), 'images/[name]_[hash:8].[ext]'),
            },
          },
        ],
      },
      {
        test: /.*\.(gif|png|jp(e*)g)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(process.cwd(), 'public', 'index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/images', to: 'images' },
        { from: 'public/assets', to: 'assets' },
      ],
    }),
    new LocalizeAssetsPlugin({
      locales: {
        es: path.resolve(__dirname, './locales/es.json'),
      },
      functionName: 'translate',
    }),
  ],
  resolve: {
    extensions: [
      '.web.js',
      '.mjs',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
      '.css',
      '.scss',
    ],
    alias: {
      '@tributi-co/common/styles.scss': require.resolve(
        '@tributi-co/common/src/styles/sass/base.scss'
      ),
      '@tributi-co/common/views': require.resolve(
        '@tributi-co/common/src/views.js'
      ),
      '@tributi-co/common/components': require.resolve(
        '@tributi-co/common/src/components'
      ),
      '@tributi-co/common/constants': require.resolve(
        '@tributi-co/common/src/constants'
      ),
      '@tributi-co/common': require.resolve('@tributi-co/common/src'),
      onboardingConfig: path.resolve(process.cwd(), 'src', 'onboarding'),
      appContext: path.resolve(process.cwd(), 'src', 'context'),
    },
  },
  externals: {
    wompi: 'WidgetCheckout',
    mathOps: 'mathops',
  },
}
