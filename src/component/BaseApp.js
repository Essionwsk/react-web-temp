import React, {Component} from 'react';
import {action} from 'mobx';
import {observer, inject} from 'mobx-react';
import Util from "../lib/commonJs";
import $ from "jquery";
import Pop from "./Pop";
import urlStore from '../urlStore';
import Cookie from 'js-cookie';
import {message, Badge, Popover, Input, Spin, Menu, Icon, Layout } from 'antd';
import FontAwesome from 'react-fontawesome'

class BaseApp extends Component {
    constructor(props) {
	super(props);

    }

    @action AJAX = (para) => {
	let _this = this;
	let _para = Object.assign({}, {
	    type: "post",
	    dataType: "json",
	    autoError: true,
	    contentType: "application/json"
	}, para);
	if (!Util.isEmpty(_para.data) && _para.type.toLowerCase() === "post" && _para.contentType === "application/json") {
	    _para.data = JSON.stringify(_para.data)
	}
	return new Promise((suc, err) => {
	    $.ajax(_para).then((data) => {
		if (Util.isEmpty(data)) {
		    console.log("服务无返回");
		    data = {
			code: 400,
			data: "",
			msg: ""
		    }
		} else if (data.code !== 200 && _para.autoError) {
		    let fromUrl = window.location.href.split("/mgmt/")[1];
		    const {history} = this.props;
		    if (data.msg.code === "UnauthorizedAccess") {
			if (Util.isEmpty(window.PopId)) {
			    if (history.location.pathname !== "/login") {
				window.PopId = Pop.alert("该页无权访问，关闭将跳转至首页", () => {
				    window.PopId = "";
				    // window.location.reload().then(
				    // history.push(`/login${!Util.isEmpty(fromUrl)?`?from=${encodeURIComponent(fromUrl)}`:''}`)
				    let passData = Cookie.get("sureChangePass");
				    if (!Util.isEmpty(passData) && passData == "true") {
					history.push(`/mgmt/changepassword`);
				    } else {
					history.push(`/mgmt`)
				    }
				    // );
				}).id;
			    }
			}
		    } else if (data.msg.code === "InvalidSession") {
			Cookie.remove("userDataMG");
			Cookie.remove('sureChangePass');
			if (Util.isEmpty(window.PopId)) {
			    if (history.location.pathname !== "/login") {
				window.PopId = Pop.alert(data.msg.message, () => {
				    window.PopId = "";
				    window.location.reload().then(
					history.push(`/login${!Util.isEmpty(fromUrl) && fromUrl.indexOf("changepassword") == -1 ? `?from=${encodeURIComponent(fromUrl)}` : ''}`)
					// history.push(`/mgmt`)
				    );
				}).id;
			    }
			}
		    } else if (data.msg.code === "noRootCert") {
			// console.log(window.PopCert)
			if (Util.isEmpty(window.PopCert) && _this.userData.actionCodes.indexOf("CA.001") != -1) {
			    _this.setRootCert()
			} else {
			    message.error(data.msg.message);
			}
			// _this.userData.actionCodes.indexOf("CA.001")!=-1?

		    } else if ($(".ant-message-notice-content").length < 1) {
			message.error(data.msg.message);
		    }
		} else if (data.code === 302) {
		    Pop.alert("无效账户，请重新登录", () => {
			history.push(`/login`);
		    })
		} else if (Util.isEmpty(data.data)) {
		    data.data = [];
		}
		suc(data)
	    }, (err) => {
		suc(err);
	    })
	})
    };


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
        let { history } = this.props;

	console.log('click ', e);

	history.push(`/mgmt/${e.key}`)

    };

    componentDidMount = () => {

    };

    render() {

	const {store: { userStore }} = this.props;
	const SubMenu = Menu.SubMenu;
	const { Sider, Content } = Layout;
	const div = {
	    display:"flex",
	    justifyContent:"center",
	    alignItems:"center",
	    height:40
	};
	return (
	    <div className="app-content" >
		<Header/>
		<div className="app-body">
		    <Layout>
			<Sider trigger={null} collapsible collapsed={this.state.collapsed} theme="light" style={{borderRight:"1px solid #DDD"}}>
			    <div style={div}>
				<Icon
				    style={{color:"#000", fontSize:"20px",cursor:"pointer"}}
				    className="trigger"
				    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
				    onClick={this._toggle}
				/>
			    </div>
			    <div className="logo" />
			    <Menu
				onClick={this._handleClick}
				defaultSelectedKeys={['page2']}
				defaultOpenKeys={['sub1']}
				mode="inline"
			    >
				<SubMenu key="sub1" title={<span><Icon type="setting" /><span>一组</span></span>}>
				    <Menu.Item key="page1">页1</Menu.Item>
				    <Menu.Item key="page2">页2</Menu.Item>
				</SubMenu>
			    </Menu>
			</Sider>
			<Content style={{margin: '15px', padding: 24, background: '#fff', minHeight: 280,}} {...this.props}>
			    {
				this.props.children
			    }
			</Content>
		    </Layout>
		</div>
		{/*<Content {...this.props}>
		    {
			this.props.children
		    }
		</Content>*/}
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

/***
 * 管理系统菜单与内容
 */
@inject('store') @observer
class Content extends BaseApp {
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
	console.log('click ', e);
    };

    componentDidMount = () => {

    };

    render() {
	const {store: { userStore }} = this.props;
	const SubMenu = Menu.SubMenu;
	const { Sider, Content } = Layout;
	return (
	    <div className="app-body">
		<div className="menu-box">
		    <Icon
			className="trigger"
			type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
			onClick={this._toggle}
		    />

		    <Layout>
			<Sider
			    trigger={null}
			    collapsible
			    collapsed={this.state.collapsed}
			>
			    <div className="logo" />
			    <Menu
				onClick={this._handleClick}
				style={{ width: 250 }}
				defaultSelectedKeys={['10']}
				defaultOpenKeys={['sub1']}
				mode="inline"
			    >
				<SubMenu key="sub1" title={<span><Icon type="setting" /><span>一组</span></span>}>
				    <Menu.Item key="1">页1</Menu.Item>
				    <Menu.Item key="10">页2</Menu.Item>
				</SubMenu>
			    </Menu>
			</Sider>
			<Layout>

			    <Content style={{
				margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
			    }}
			    >
				Content
			    </Content>
			</Layout>
		    </Layout>
		</div>

	    </div>
	)
    }
}


class CakeLoading extends BaseApp {
    constructor(props) {
	super(props);
    }

    render() {
	return (
	    <div className="cake-loading" style={this.props.style ? this.props.style : {}}>
		<Spin {...this.props}/>
	    </div>
	)
    }
}

/***
 * 表单模板的预设结构
 */
class FromGroup extends BaseApp {
    constructor(props) {
	super(props);
    }

    _onRemark = (remark) => {
    };

    render() {
	return (
	    <div className="cake-from-group" style={this.props.style}>
		<div className="cake-from-content">
		    <div className="cake-from-label" style={this.props.labelStyle}>
			{this.props.label}
			{this.props.must ? <span style={{color: "red"}}>*</span> : ''}
			{this.props.remark ? <i onClick={this._onRemark.bind(this, this.props.remark)}
						className="fa fa-question-circle-o"/> : ''}
		    </div>
		    <div className="cake-from-content" style={this.props.contentStyle}>
			{this.props.children}
		    </div>
		</div>
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
    enPage:(pageAct, pageSize)=>{
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
    dePage:(start, hit)=>{
	return {
	    pageAct: (start + hit) / start,
	    pageSize: hit
	}
    },
    /***
     * 获取域名之后的url地址，切割到参数部分
     * @returns {string}
     */
    getUrlPath:()=>{
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
    parseUrl:(url)=>{
	return url
	.substring(url.indexOf('?') + 1)
	.split('&')
	.map((query) => query.split('='))
	.reduce((params, pairs) => (params[pairs[0]] = pairs[1] || '', params), {});
    }
};


export {BaseApp, MainBody, FromGroup, CakeLoading, exFunc}
export default BaseApp;
