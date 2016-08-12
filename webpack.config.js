import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

module.exports = {
  entry: './assets/js/index.js',
  output: { path: __dirname + '/assets/js', filename: 'bundle.js' },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin("[name].css")
  ],
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.(?:css)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
        include: /(node_modules)/
      }
    ]
  }
}
