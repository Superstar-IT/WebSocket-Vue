const pkg = require('./package.json')

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? pkg.constants.appUrl + '/'
    : '/',
  chainWebpack (config) {
    config.module.rules.delete('svg')
    config.optimization.delete('splitChunks')
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'vue-svg-loader',
        },
        {
          test: /\.md/,
          use: 'raw-loader'
        }
      ],
    }
  },
  devServer: {
    disableHostCheck: true
  },
  productionSourceMap: true
}
