// @flow
//
import path from 'path'
import webpack from 'webpack'

module.exports = {
  entry: './assets/js/index.js',
  output: { path: __dirname + '/assets/js', filename: 'bundle.js' },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
}
