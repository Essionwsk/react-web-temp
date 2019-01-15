let baseConfig = require('./webpack.config.base');

baseConfig.devtool = 'source-map';
baseConfig.devServer = {
    // host: '10.1.4.159',
    inline: true,           //true:内联模式，打包时插入一个脚本来输出变化
    port: 3000,             //热加载端口
    compress:true,          //gzip压缩
    historyApiFallback: true,
    proxy: {
	"/mgmt-b":{
	    // target: 'http://10.1.3.160:8002/',
	    target: 'http://10.1.3.224:4010/',
	    // target:'http://127.0.0.1:8001/',
	    changeOrigin: true
	}
    }
};
module.exports = baseConfig;

