const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = env => {
  const isProduction = env && env.production;
  const buildDir = isProduction ? 'pages' : 'pages-dev';

  let plugins = [
    new HtmlWebpackPlugin({ template: './docs/index.html' }),
    new ExtractTextPlugin('styles.css')
  ];

  if (isProduction) {
    plugins.push(
      new CleanWebpackPlugin([buildDir], {
        verbose: true,
        dry: false
      })
    );
  } else {
    plugins.push(new webpack.NamedModulesPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    entry: {
      app: './docs/index.js'
    },
    output: {
      path: path.resolve(__dirname, buildDir),
      filename: '[name].js'
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    devServer: {
      contentBase: buildDir,
      hot: true
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{ loader: 'css-loader', options: { importLoaders: 1 } }]
          })
        },
        {
          test: /\.html$/,
          use: 'raw-loader'
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
          loader: 'file-loader'
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          })
        },
        {
          test: /\.yml$/,
          use: ['json-loader', 'yaml-loader']
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader'
            },
            {
              loader: 'markdown-loader',
              options: {
                gfm: true,
                tables: true
              }
            }
          ]
        }
      ]
    },
    plugins: plugins
  };
};

module.exports = config;
