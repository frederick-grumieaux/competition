const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "none", //Please no auto magic, even if it is good for me. 
    entry: {
        app: path.resolve(__dirname, "../src/index.js"),
        styles: path.resolve(__dirname, "../src/styles/style.scss")
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        //filename: 'app.js',
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
            }
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        port: 9000
    }
}