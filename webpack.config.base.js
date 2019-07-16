const path                  = require('path');
const webpack               = require('webpack');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const config                = require('./config').config;
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const PostCssPresetEnv      = require('postcss-preset-env');
const CssNaNo               = require('cssnano');

const devMode = process.env.NODE_ENV !== 'production';
let ROOT_PATH = path.resolve(__dirname);
let APP_PATH = path.resolve(ROOT_PATH, 'src');
let NODE_MODULE = path.resolve(ROOT_PATH, 'node_modules'); //__dirname 中的 node_modules 目录

module.exports = {
    entry: {
        index: APP_PATH + '/route/index.js',
        vendor: ["react", "react-dom", "react-router-dom", "antd"]
    },
    output: {
        path: `${__dirname}/${config.showShaBox ? 'public-sandbox' : 'public'}`,
        //path: __dirname+'/public',//编译到指定根目录
        filename: 'js/[name].js',//编译后的js存放地址与名称[chunkhash:4]
        publicPath: config.publicPath,
        chunkFilename: 'js/[name].js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({//根据模板插入css/js等生成最终HTML
            filename: `index.html`, //生成的html存放路径，相对于 path
            template: 'src/index.html', //html模板路径
            inject: 'body',
            hash: true,
            favicon: "src/images/favicon.ico",
            appName: config.appName,
            chunks: ['vendor', "index"]
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "vendor",
                    chunks: "initial",
                    minChunks: 2
                },
            }
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: NODE_MODULE,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-react',
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    browsers: ['last 2 versions', 'ie > 8']
                                }
                            }
                        ]
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        ['import', { libraryName: 'antd', style: "css" }]
                    ]
                }
            }
        },{
            test: /(\.less|\.css)$/,
            // exclude: NODE_MODULE,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader : 'css-loader',
                    options: {
                        importLoaders  : 2
                    }
                },
                {
                    loader : 'postcss-loader',
                    options: {
                        plugins: [
                            PostCssPresetEnv(),
                            CssNaNo({
                                reduceIdents: false,
                                autoprefixer: false
                            })
                        ]
                    }
                },
                {
                    loader : 'less-loader',
                    options: {
                        javascriptEnabled: true,
                        paths: APP_PATH,
                    }
                },
            ],

        }, {
            // exclude: NODE_MODULE,
            test: /\.(gif|jpg|png|ico)$/,//图片类与样式类分开放置
            use: 'url-loader?limit=5120&name=images/[hash:4].[name].[ext]&publicPath=../'
        }, {
            // exclude: NODE_MODULE,
            test: /\.(woff|woff2|svg|eot|otf|ttf)$/,
            use: 'url-loader?limit=5120&name=css/[hash:4].[name].[ext]&publicPath=../'
        }, {
            // exclude: NODE_MODULE,
            test: /\.(xlsx|csv)$/,
            use: 'url-loader?limit=5120&name=file/[name].[ext]&publicPath=../'
        }]
    },
    stats:{
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }
};

