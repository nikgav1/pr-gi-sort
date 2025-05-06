const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/pages/main/index.js',
    product: './src/pages/product/product.js',
    signup: './src/pages/signup/signup.js',
  },
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
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/main/index.html',
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/product/product.html',
      filename: 'product.html',
      chunks: ['product'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/signup/signup.html',
      filename: 'signup.html',
      chunks: ['signup'],
    }),
  ],
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all', // Extracts common dependencies into separate chunks
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
