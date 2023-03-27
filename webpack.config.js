const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
    mode: 'development', // or 'production'
    entry: {
        hotreload: 'react-hot-loader/patch',
        background: path.resolve(__dirname + '/src/background.js'),
        popup: path.resolve(__dirname + '/src/popup.js'),
        content: path.resolve(__dirname + '/src/content.js')
    },
    resolve: {
        alias: {
            $Src: path.resolve(__dirname, './src')
        }
    },
    output: {
        filename: 'assets/js/[name].js',
        path: path.resolve(__dirname + '/build'),
        publicPath: '/'
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
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ["@babel/plugin-syntax-jsx"]
                    }
                }
            }
        ]
    },
    devServer: {
        devMiddleware: {
            writeToDisk: true
        },
        static: {
            directory: path.resolve(__dirname + '/build')
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{ 
                from: path.resolve(__dirname + '/public/'), 
                to: path.resolve(__dirname + '/build/') 
            }],
        })
    ]
};

module.exports = config;