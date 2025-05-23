const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Find all page directories in src/pages/
const pagesDir = path.join(__dirname, 'src/pages');
const pages = fs.readdirSync(pagesDir).filter(dir => {
  const fullDir = path.join(pagesDir, dir);
  return (
    fs.statSync(fullDir).isDirectory() &&
    fs.existsSync(path.join(fullDir, `${dir}.js`)) &&
    fs.existsSync(path.join(fullDir, `${dir}.html`))
  );
});

const entry = {};
pages.forEach(page => {
  entry[page] = `./src/pages/${page}/${page}.js`;
});

// Build HtmlWebpackPlugin instances
const htmlPlugins = pages.map(
  page =>
    new HtmlWebpackPlugin({
      template: `./src/pages/${page}/${page}.html`,
      filename: `${page}.html`,
      chunks: [page],
      inject: 'body',
    })
);

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  mode: 'production',
  optimization: {
    minimizer: [
      `...`, // Keep existing minimizers
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
};
