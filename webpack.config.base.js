const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
const config = require('./config').config; //生成html
// let extractLESS = new ExtractTextPlugin('style2.css');
// let extractCSS = new ExtractTextPlugin('style.css');

let ROOT_PATH = path.resolve(__dirname);
let APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录
let NODE_MODULE = path.resolve(ROOT_PATH, 'node_modules'); //__dirname 中的 node_modules 目录

module.exports = {
    entry: {
        index:APP_PATH+'/route/index.js',
        vendor:["react","react-dom","react-router-dom","jquery","antd"]
    },
    output: {
        path: __dirname+'/public',//编译到指定根目录
        filename: 'js/[name].js',//编译后的js存放地址与名称[chunkhash:4]
        publicPath:config.publicPath,
        chunkFilename:'js/[name].js'
    },
    plugins: [
        new ExtractTextPlugin('css/[name].css'),// extractLESS,extractCSS,
        new webpack.optimize.CommonsChunkPlugin('vendor'),//将第三方依赖独立打包
	new HtmlWebpackPlugin({//根据模板插入css/js等生成最终HTML
	    filename: `index.html`, //生成的html存放路径，相对于 path
	    template: 'src/index.html', //html模板路径
	    inject: 'body',
	    hash: true,
	    favicon:"src/images/favicon.ico",
	    appName:config.appName,
	    chunks: ['vendor',"index"]
	})
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: NODE_MODULE,
            use:{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015','react','stage-1'],
                    plugins: ['transform-decorators-legacy',"transform-class-properties",
			[
			    "import",
			    {
				"libraryName": "antd",
				"style": "css"
			    }
			]],
		    compact: true,
                }
            }
        },{
            test: /\.css$/,
	    // exclude: NODE_MODULE,
            use: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})
        },{
            test:  /\.less$/i,
            exclude: NODE_MODULE,
            use: ExtractTextPlugin.extract([ 'css-loader', 'less-loader' ])
        },{
            exclude: NODE_MODULE,
            test: /\.(gif|jpg|png|ico)$/,//图片类与样式类分开放置
            use: 'url-loader?limit=8192&name=images/[hash:4].[name].[ext]&publicPath=../'
        },{
            exclude: NODE_MODULE,
            test: /\.(woff|woff2|svg|eot|otf|ttf)$/,
            use: 'url-loader?limit=8192&name=css/[hash:4].[name].[ext]&publicPath=../'
        }]
    }
};

