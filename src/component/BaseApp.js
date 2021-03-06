import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import { Pop }from "tjfoc-react-component";
import urlStore from '../urlStore';
import Cookie from 'js-cookie';
import {message, Badge, Popover, Input, Spin, Menu, Icon, Layout} from 'antd';
import FontAwesome from 'react-fontawesome'
import axios from 'axios'

class BaseApp extends Component {
    constructor(props) {
        super(props);

	    this.Axios = (option)=>{
	        let _option = Object.assign({},{
                contentType: "application/json",
                autoError:true
            },option);
            return new Promise((suc,err)=>{
                axios(_option).then((data)=>{
                    suc(data.data);
                    if(data.data.code !== 200 && _option.autoError){
                        Pop.alert(data.data.message);
                    }
                })
            })
        };



    }


    // 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state
    //componentWillMount(){}

    // 组件渲染之后调用，可以通过this.getDOMNode()获取和操作dom节点，只调用一次
    //componentDidMount(){}

    // 组件接受新的state或者props时调用，调用this.forceUpdate会跳过此步骤
    //shouldComponentUpdate(nextProps, nextState){}

    // 组件初始化时不调用，只有在组件将要更新时才调用，此时可以修改state
    //componentWillUpdate(nextProps, nextState){}

    //组件初始化时不调用，组件更新完成后调用，此时可以获取dom节点。
    //componentDidUpdate(){}

    //组件将要接收新的props执行
    //componentWillRecevieProps(){}

    //组件将要卸载时调用
    //componentWillUnmount(){}

    render() {

    }
}

/***
 * 页面主结构
 */
@inject('store') @observer
class MainBody extends BaseApp {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: false,
        };

    }

    _toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    _handleClick = (e) => {
        let {history} = this.props;

        console.log('click ', e);

        history.push(`/mgmt/${e.key}`)

    };

    componentDidMount = () => {

    };

    render() {

        const {store: {userStore}} = this.props;
        const SubMenu = Menu.SubMenu;
        const {Sider, Content} = Layout;
        const div = {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 40
        };
        return (
            <div className="app-content">
                <Header/>
                <div className="app-body">
                    <Layout>
                        <Sider trigger={null} collapsible collapsed={this.state.collapsed} theme="light"
                               style={{borderRight: "1px solid #DDD"}}>
                            <div style={div}>
                                <Icon
                                    style={{color: "#000", fontSize: "20px", cursor: "pointer"}}
                                    className="trigger"
                                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this._toggle}
                                />
                            </div>
                            <div className="logo"/>
                            <Menu
                                onClick={this._handleClick}
                                defaultSelectedKeys={['page2']}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                            >
                                <SubMenu key="sub1" title={<span><Icon type="setting"/><span>一组</span></span>}>
                                    <Menu.Item key="page1">页1</Menu.Item>
                                    <Menu.Item key="page2">页2</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Content
                            style={{margin: '15px', padding: 24, background: '#fff', minHeight: 280,}} {...this.props}>
                            {
                                this.props.children
                            }
                        </Content>
                    </Layout>
                </div>
            </div>
        )
    }
}

/***
 * 管理系统头部容器
 */
class Header extends BaseApp {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app-header">
                <div className="app-logo">logo</div>
                <div className="app-user">用户</div>
            </div>
        )
    }
}

const exFunc = {
    /***
     *  分页数据对接，enPage
     * @param pageAct
     * @param pageSize
     * @returns {{start: number, hit: *}}
     */
    enPage: (pageAct, pageSize) => {
        return {
            start: pageSize * (pageAct - 1),
            hit: pageSize
        }
    },
    /***
     *  分页数据对接，dePage
     * @param start
     * @param hit
     * @returns {{pageAct: number, pageSize: *}}
     */
    dePage: (start, hit) => {
        return {
            pageAct: (start + hit) / start,
            pageSize: hit
        }
    },
    /***
     * 获取域名之后的url地址，切割到参数部分
     * @returns {string}
     */
    getUrlPath: () => {
        if (typeof window !== "undefined") {
            let href = window.location.href.split("?")[0];
            let hrefArr = href.split("/");
            return `${hrefArr[hrefArr.length - 1]}`;
        } else {
            return ``;
        }
    },
    /***
     * 解析传入完整的url问号后面的参数 并格式化成obj对象返回
     * @param url
     * @returns {{}}
     */
    parseUrl: (url) => {
        return url
            .substring(url.indexOf('?') + 1)
            .split('&')
            .map((query) => query.split('='))
            .reduce((params, pairs) => (params[pairs[0]] = pairs[1] || '', params), {});
    }
};


export {BaseApp, MainBody, exFunc}
export default BaseApp;
