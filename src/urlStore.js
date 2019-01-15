module.exports = {
    login:"/mgmt-b/auth/login",//登录
    logout:"/mgmt-b/auth/logout",//登出
    getUserData:"/mgmt-b/user/getUserData",//获取用户信息
    updateInfo:"/mgmt-b/user/updateInfo",//修改用户密码
    forceResetPassword:"/mgmt-b/userManage/forceResetPassword",//强制重置密码
//CA
 //证书管理
    getCertList:"/mgmt-b/ca/getCertList",//获取证书列表
    downloadCert:"/mgmt-b/ca/downloadCert",//下载证书
    downloadRevokeCert:"/mgmt-b/ca/downloadRevokeCert",//下载吊销证书
    downloadTool:"/mgmt-b/ca/downloadTool",//下载工具
    approveCert:"/mgmt-b/ca/approveCert",//审批证书
    rejectCert:"/mgmt-b/ca/rejectCert",//驳回证书
    revokeCert:"/mgmt-b/ca/revokeCert",//吊销证书

    applyCert:"/mgmt-b/ca/applyCert",//申请新证书
    genKeysAndReq:"/mgmt-b/ca/genKeysAndReq",//在线生成
 //账号管理
    getUserManageList:"/mgmt-b/userManage/getUserList",//获取用户列表
    updateUserPassword:"/mgmt-b/userManage/updateUserPassword",//修改用户密码
    deleteUser:"/mgmt-b/userManage/deleteUser",//删除用户
    addUser:"/mgmt-b/userManage/addUser",//添加用户
 //CA根证书
    checkCA:"/mgmt-b/ca/checkCA",//检查是否存在根证书
    createCA:"/mgmt-b/ca/createCA",//生成根证书
    importCA:"/mgmt-b/ca/importCA",//导入根证书
    getCAList:"/mgmt-b/ca/getCAList",//获取CA列表
 //utxo
    getAddressList:'/mgmt-b/utxo/getAddressList',//获取token地址列表
    addAddress:'/mgmt-b/utxo/addAddress',//添加token地址
    deleteAddress:"/mgmt-b/utxo/deleteAddress",//删除token地址

    getCollectionAddress:"/mgmt-b/utxo/getCollectionAddress",//获取Token法币归集账号地址列表
    addCollectAddress:"/mgmt-b/utxo/addCollectAddress",//添加归集地址
    updateCollectAddress:"/mgmt-b/utxo/updateCollectAddress",//修改归集地址

    getTokentypeList:"/mgmt-b/utxo/getTokentypeList",//获取Token type列表
    changeState:"/mgmt-b/utxo/changeState",//Token type 操作：锁定，激活
//消息中心
    getMessageList:"/mgmt-b/messages/getMessagesList",//获取消息列表
    getMessageDetail:"/mgmt-b/messages/getMessage",//获取消息详情
    updateStatus:"/mgmt-b/messages/updateStatus",//更新消息状态
    getTotalUnreadCount:"/mgmt-b/messages/getTotalUnreadCount",//获取未读总数

//节点
    getNodeList:"/mgmt-b/node/getNodeList",//获取节点列表
    getUserListForNode:"/mgmt-b/node/getUsers",//获取可操作节点的用户列表
    getNodeUsers:"/mgmt-b/node/getNodeUsers",//获取节点已配置的用户
    addUserForNode:"/mgmt-b/node/addUser",//节点分配用户
    removeUserForNode:"/mgmt-b/node/DeleteUsers",//节点删除用户（批量操作）
    getItemThreshold:"/mgmt-b/node/getItemThreshold",//获取节点当前监测项目峰值阈值
    getThreshold:"/mgmt-b/node/getThreshold",//获取节点阈值配置信息
    setThreshold:"/mgmt-b/node/setThreshold",//配置阈值
    getNodeDetail:"/mgmt-b/node/getNodeDetail",//获取节点详情
    getNodeResource:"/mgmt-b/node/getNodeResource",//获取节点资源

//查询区块
    getLatestBlocks:"/mgmt-b/home/getLatestBlocks",//首页最新区块列表
    getLatestTransactions:"/mgmt-b/home/getLatestTransactions",//首页最新交易列表
    getSummary:"/mgmt-b/home/getSummary",//首页概览
    searchByHeight:"/mgmt-b/explorer/searchByHeight",//区块公示:根据区块高度搜索
    searchByTime:"/mgmt-b/explorer/searchByTime",//区块公示:根据时间搜索
    getTxsList:"/mgmt-b/explorer/getTxsList",//存证公示: 获取存证列表
    getTxsListByBlock:"/mgmt-b/explorer/getTxsListByBlock",//根据区块hash获取存证列表
    getBlockDetail:"/mgmt-b/explorer/getBlockDetail",//获取区块详情
    getTxsDetail:"/mgmt-b/explorer/getTxsDetail",//根据区块hash获取存证列表
    getNodeStatus:"/mgmt-b/home/getNodeStatus",//为true继续调用之后接口，为false报节点未启用
//控制台
    getLogs:"/mgmt-b/audit/getLogList",//获取日志列表,
    getLogDetail:"/mgmt-b/audit/getLogDetail",//获取日志详情,
};
