const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development', // or 'production'
    entry: {
        background: './src/background.js',
        popup: './src/popup.js',
        content: './src/content.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname + '/dist')
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './build', to: './' }
            ]
        })
    ]
};
