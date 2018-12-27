const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: "none", //Please no auto magic, even if it is good for me. 
    context: path.resolve(__dirname),
    entry: {
        //Input file for webpack = output of typescript compiler. (so 1st run tsc --watch -p .. and then also start this one.)
        //reasoning: that way we can easily find (if something goes wrong) where the problem  lays. TypeScript or Webpack.
        //           also we don't need to care anymore about keeping stuff equal.
        //Also: TypeScript does not have to do the conversion to ES5, that is the job of webpack. So the output of TS is very readable.
        app: path.resolve(__dirname, "../dist/index.js"),
        //We also need to compile our styles.
        //Typescript does not touch those, so we can find the in the src folder.
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
            'shell': path.resolve(__dirname, '../dist/app-shell/'),
            'src': path.resolve(__dirname, '../dist/'),
            'comp': path.resolve(__dirname, '../dist/components/'),
            'models': path.resolve(__dirname, '../dist/models/'),
            'store': path.resolve(__dirname, '../dist/store')
        },
        modules: [path.resolve(__dirname, 'node_modules')]
    },  
    plugins: [
        //Copy all the files from the ../www/**/* folder to the output folder (= ../dist)
        new CopyWebpackPlugin([{ from: 'www', force: true }], { context: '../.' }),
        //Create a css file for the styles entry point. (else we get styles.js)
        new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" }),
        //Generates a graph with all the files and their size. (uncomment to see)
        //new BundleAnalyzerPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                //Note: I don't think this is still used.
                //We use a separate step for converting tsx files to js files.
                //instead > the new .js step is used to transpile to ES2015
                test: /\.tsx?$/,
                use: ['ts-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets:['@babel/preset-env'],
                        plugins:[
                            [ '@babel/plugin-proposal-object-rest-spread', {}],
                            [ '@babel/plugin-transform-runtime', {}],
                            //[ '@babel/plugin-proposal-class-properties', { "loose": true } ]
                        ]
                    }
                }],
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