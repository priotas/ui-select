const path = require('path');
const libraryName = '[name]';
const outputFile = libraryName + '.js';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = env => {
  return {
    entry: {
      select: './src/select.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
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
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    ]
  };
};

module.exports = config;
