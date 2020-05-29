exports.config = {
    //项目名称
    appName:"应用系统模板",


    //开发模式下的访问端口
    port:3000,


    //编译路径前缀 用于做不同系统的路径兼容 \
    // 开发：win10的dev模式、linux系统 使用 /
    // 编译：win10、winServer系统下 使用 ./
    publicPath:"/",

    //------------------ 系统变量 ------- ↓ ---------------//

    /***
     * 菜单
     */
    _menuData_ : [],

    /***
     * 从cookie、session中提取用户信息的key
     */
    _userData_:"userData",

    /***
     * 全局表格分页默认初始化配置
     */
    _pagination_:{
        total:0,
        current:1,
        pageSize:10
    },

    /***
     * 全局表格分页默认初始化配置
     */
    _pageSizeOptions_:[10,20,50,100]
};
