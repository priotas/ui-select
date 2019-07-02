const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = env => {
  const isProduction = env && env.production;
  const buildDir = isProduction ? 'pages' : 'pages-dev';

  const plugins = [
    new HtmlWebpackPlugin({ template: './docs/index.html' }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: !isProduction ? '[name].css' : '[name].[hash].css',
      chunkFilename: !isProduction ? '[id].css' : '[id].[hash].css'
    })
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
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
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
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
          loader: 'file-loader'
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProduction
              }
            },
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: plugins
  };
};

module.exports = config;
