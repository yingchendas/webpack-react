var webpack = require('webpack');
module.exports = {
    entry: {
        page:'./js/test/app.js',
        pages:'./js/test1/app1.js'
    },
    output: {
        path: __dirname,
        filename: 'build/[name]bundle.js'
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
            }
        ]
    }
}