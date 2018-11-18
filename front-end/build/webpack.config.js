const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "none", //Please no auto magic, even if it is good for me. 
    entry: path.resolve(__dirname, "../src/index.js"),
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: 'app.js',
    },
    plugins: [
        //Copy all the files from the ../www/**/* folder to the output folder (= ../dist)
        new CopyWebpackPlugin([{ from: 'www', force: true }], { context: '../.' })
    ]
}