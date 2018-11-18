const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
            'shell': path.resolve(__dirname, '../src/app-shell/'),
            'src': path.resolve(__dirname, '../src/'),
            'comp': path.resolve(__dirname, '../src/components/'),
            'store': path.resolve(__dirname, '../src/store')
        }
    },  
    plugins: [
        //Copy all the files from the ../www/**/* folder to the output folder (= ../dist)
        new CopyWebpackPlugin([{ from: 'www', force: true }], { context: '../.' }),
        //Create a css file for the styles entry point. (else we get styles.js)
        new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" }),
        //Generates a graph with all the files and their size. (uncomment to see)
        //new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
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