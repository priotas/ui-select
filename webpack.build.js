const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');
const libraryName = '[name]';
const outputFile = libraryName + '.js';

const config = env => {
  return {
    entry: {
      select: './src/select.js',
      'select.tpl': './src/select.tpl.js'
    },
    output: {
      path: path.resolve(__dirname, 'release'),
      filename: outputFile,
      library: libraryName,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    externals: {
      angular: {
        commonjs: 'angular',
        commonjs2: 'angular',
        amd: 'angular',
        root: 'angular'
      }
    },
    optimization: {
      // We no not want to minimize our code.
      minimize: false
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true,
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false
              }
            }
          ]
        }
      ]
    }
  };
};

module.exports = config;
