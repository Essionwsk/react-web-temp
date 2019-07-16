const webpack = require('webpack');
let baseConfig = require('./webpack.config.base');

baseConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify("production"),
    })
);

module.exports = baseConfig;

