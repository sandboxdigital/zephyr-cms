// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Configuration - you can change these settings

// Destination - where all the files are save after processing. Defaults to /public/assets but you can change to
// something like public/wp-content/themes/THEME_NAME/assets for a Wordpress project

const publicPath = '../../../../laravel/public/';
const assetPath = 'cms-assets/';
const distPath = publicPath + assetPath;
const srcPath = "./";

const watchPaths = [
    srcPath + 'scss/*.scss',
    srcPath + 'js/*.js',
];

let IS_HOT = process.env.NODE_ENV === 'hot';
let IS_DEV = process.env.NODE_ENV === 'dev';
let IS_PROD = process.env.NODE_ENV === 'production';
let IS_MIN = process.env.NODE_ENV === 'min';

// Plugins
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: {
        cms: [
            srcPath + 'js/cms.js',
            srcPath + 'scss/cms.scss'
        ]
    },

    output: {
        path: path.resolve(__dirname, distPath),
        filename: 'js/[name].js',
        publicPath : IS_HOT ? 'http://localhost:8081/'+ assetPath : '/' + assetPath
    },

    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'vendor',
    //                 chunks: "all"
    //             }
    //         }
    //     }
    // },

    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },

    plugins: [
        new WebpackNotifierPlugin({
            alwaysNotify: true,
        }),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({
            filename:"css/[name].css",
            disable: IS_HOT
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: 'js/[name].js.map',
        }),
        new VueLoaderPlugin(),
    ],

    module: {
        rules: [{
                test: /.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        // presets: ['@babel/preset-env'],
                        cacheDirectory:'./babel-cache'
                    }
                }],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?url=false!sass-loader",
                }),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }, // inline base64 URLs for <=8k images, direct URLs for the rest
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?publicPath=../&name=fonts/[name].[ext]'
            }
        ]
    },

    devServer: {
        contentBase: path.resolve(__dirname, publicPath),
        // host: '0.0.0.0',
        port: 8081,
        disableHostCheck: true,
        compress: true,
        overlay: true,
        stats: {
            colors: true
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    },
};