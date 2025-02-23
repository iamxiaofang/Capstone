const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const WorkboxPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env) => {

    const isProduction = !env.WEBPACK_SERVE;
    const mode = isProduction ? 'production' : 'development';

    return {
        entry: './src/client/index.js',
        mode,
        devtool: 'source-map',
        stats: 'minimal',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', {
                        loader: "sass-loader",
                        options: {
                            api: "modern-compiler"
                        },
                    }]
                }
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/client/views/index.html",
                filename: "./index.html",
            }),
            // new WorkboxPlugin.GenerateSW(),
            new CleanWebpackPlugin({
                // Simulate the removal of files
                dry: true,
                // Write Logs to Console
                verbose: true,
                // Automatically remove all unused webpack assets on rebuild
                cleanStaleWebpackAssets: true,
                protectWebpackAssets: false
            }),
            new WorkboxPlugin.GenerateSW()
        ],
        devServer: {
            port: 3000,
            allowedHosts: 'all'
        }
    }
}
