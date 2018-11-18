const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "none", //Please no auto magic, even if it is good for me. 
    context: path.resolve(__dirname),
    entry: {
        app: path.resolve(__dirname, "../src/index.ts"),
        styles: path.resolve(__dirname, "../src/styles/style.scss")
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        libraryTarget: 'umd',
        library: {
            root: 'MyApp',
            amd: 'my-app',
            commonjs: 'my-common-app'
        },
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
            tslib: path.resolve(__dirname, 'node_modules/tslib/tslib.js'),
            'app-shell': path.resolve(__dirname, '../src/app-shell/')
        }
    },  
    plugins: [
        //Copy all the files from the ../www/**/* folder to the output folder (= ../dist)
        new CopyWebpackPlugin([{ from: 'www', force: true }], { context: '../.' }),
        new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: { logLevel: 'info' }
            }
        ],
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        port: 9000
    }
}