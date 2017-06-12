var webpack = require('webpack');
module.exports = {
    entry: {
        page:'./src/app.js',
        page1:'./src/app1.js'
    },
    output: {
        path: __dirname,
        filename: 'public/js/[name]bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                loader: 'css-loader'
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            },
            {
                // 小于8KB的图片使用base64内联
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'

            }
        ]
    }
}