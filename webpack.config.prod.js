const webpack = require('webpack');
let baseConfig = require('./webpack.config.base');

baseConfig.plugins.push(
    new webpack.DefinePlugin({
	'process.env.NODE_ENV':JSON.stringify("production"),
    })
);
baseConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
	warnings: false,
	compress: {
	    join_vars: true,
	    warnings: false,
	},
	toplevel: false,
	ie8: true,
    })
);
module.exports = baseConfig;

