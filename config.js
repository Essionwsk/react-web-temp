exports.config = {
    //项目名称
    appName:"梧桐链管理系统",


    //区块浏览的 iframe 外链
    blockOverview:"https://web.ot.tj-fintech.com",


    //开发模式下的访问端口
    port:3000,


    //编译路径前缀 用于做不同系统的路径兼容
    publicPath:"/",


    //模块配置
    module:[
    "certManage",           //证书管理
	"applyNewCert",         //证书管理->申请新证书
	"rootCert",             //CA根证书

	"peerList",             //节点管理
	"peerDetail",           //节点管理->详情
	"peerSetting",          //节点管理->详情->配置
	"peerAllocationIndex",  //节点分配

	"blockOverviewIndex",   //区块查询
	"blockPublicity",       //区块查询->查看全部区块
	"blockDetail",          //区块查询->查看全部区块->区块详情
	"blockTwoDetail",          //区块查询->查看全部区块->区块详情2
	"dealPublicity",        //区块查询->查看全部交易
	"dealDetail",           //区块查询->查看全部交易->交易详情

	"tokenManage",          //Token地址管理
	"tokenAddAddress",      //Token地址管理->添加地址
	"collectAddress",       //归集地址管理
	"updateAddress",        //归集地址管理->修改归集地址
	"collectAddAddress",    //归集地址管理->添加归集地址
	"tokenTypeManage",      //TokenType管理

	"accManage",            //账号管理
	"addAccount",           //账号管理->添加新账号

    "changePassword",        //强制修改密码
	"logs"                   //查看日志
]
};
