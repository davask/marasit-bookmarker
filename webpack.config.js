const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
    mode: 'development', // or 'production'
    entry: {
        hotreload: 'react-hot-loader/patch',
        background: './src/background.js',
        popup: './src/popup.js',
        content: './src/content.js'
    },
    output: {
        filename: 'assets/js/[name].js',
        path: path.resolve(__dirname + '/build')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: 'file-loader'
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            mimetype: 'image/png'
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        devMiddleware: {
            writeToDisk: true
        },
        static: {
            directory: './build'
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{ from: './public/', to: './' }],
        })
    ]
};

module.exports = config;