const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], 
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: './src', 
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], 
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'My App',
            template: './src/index.html',
            filename: 'index.html', 
        }),
    ],
    devServer: {
        static: path.join(__dirname, 'dist'),
        port: 9000,
    },
    mode: 'development', 
};