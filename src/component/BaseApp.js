import React, {Component} from 'react';
import {action} from 'mobx';
import {observer, inject} from 'mobx-react';
import Util from "../lib/commonJs";
import $ from "jquery";
import Pop from "./Pop";
import RightInform from './RightInform';
import urlStore from '../urlStore';
import Cookie from 'js-cookie';
import {message, Badge, Popover, Input, Spin} from 'antd';
import FontAwesome from 'react-fontawesome'
import CakeMenu from './Menu'

const {TextArea} = Input;

class BaseApp extends Component {
    constructor(props) {
	super(props);
	this.userData = !Util.isEmpty(Cookie.get("userDataMG")) ? JSON.parse(Cookie.get("userDataMG")) : "";
	this.enPage = (pageAct, pageSize) => {
	    return {
		start: pageSize * (pageAct - 1),
		hit: pageSize
	    }
	};
	this.dePage = (start, hit) => {
	    return {
		pageAct: (start + hit) / start,
		pageSize: hit
	    }
	};
	this.buffurCertInfo = {
	    usefulDay: "",
	    commonName: "",
	    organization: "",
	    country: ""
	}
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
    setRootCert = () => {//生成根证书
	let urlString = window.location.href
	let regCommonName = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
	let regUsefulDay = /^[1-9]\d*$/;
	this.rootCertData = this.buffurCertInfo;
	let $Pop;
	this.createCA = () => {
	    let _this = this;
	    if (Util.isEmpty(_this.rootCertData.usefulDay)) {
		message.warning("请输入根证书有限期")
	    } else if (regUsefulDay.test(_this.rootCertData.usefulDay) != true || _this.rootCertData.usefulDay > 36500) {
		message.warning("有限期天数限1-36500的正整数")
	    } else if (Util.isEmpty(_this.rootCertData.commonName)) {
		message.warning("请输入域名")
	    } else if (regCommonName.test(_this.rootCertData.commonName) == false) {
		message.warning("域名格式错误")
	    }
	    // else if(Util.isEmpty(_this.rootCertData.organization)){
	    // 	message.warning("请输入组织机构")
	    // }else if(Util.isEmpty(_this.rootCertData.country)){
	    // 	message.warning("请输入国家")
	    // }
	    else {
		_this.AJAX({
		    url: urlStore.createCA,
		    data: _this.rootCertData
		}).then((data) => {
		    if (data.code === 200 & !Util.isEmpty(data.data)) {
			message.success("根证书生成成功").then(() => {
			    $Pop.remove();
			    if (urlString.indexOf("rootcert") != "-1") {
				location.reload();
			    }
			    window.PopCert = "";
			})
		    } else if (data.msg.code === "RootCertAlreadyExists") {
			$Pop.remove();
			window.PopCert = "";
		    } else {
		    }
		})
	    }
	}
	if (Util.isEmpty(window.PopCert)) {
	    $Pop = Pop.hint({
		title: "生成根证书",
		width: "400px",
		showCancel: false,
		showOk: false,
		showFooter: false,
		closeIcon: false,
		content: (
		    <div className="showpopdetails">
			{/* <div className="popdetails">
							<div className="popdetails-title">根证书IP</div>
							<div className="popdetails-content">
								<Input placeholder="---请输入---"
									// onChange={(e)=>{this.static.account= e.currentTarget.value}}
									// onKeyUp={(e)=>{if(e.keyCode === 13){this.searchGetList()}}}
								/>
							</div>
						</div> */}
			<div className="popdetails">
			    <div className="popdetails-title">根证书有效期(天)</div>
			    <div className="popdetails-content">
				<Input placeholder="---请输入---" maxLength="5"
				       defaultValue={this.buffurCertInfo.usefulDay}
				       onChange={(e) => {
					   this.buffurCertInfo.usefulDay = e.currentTarget.value
				       }}
				/>
			    </div>
			</div>
			<div className="popdetails">
			    <div className="popdetails-title">域名</div>
			    <div className="popdetails-content">
				<Input placeholder="限128字符" maxLength="128"
				       defaultValue={this.buffurCertInfo.commonName}
				       onChange={(e) => {
					   this.buffurCertInfo.commonName = e.currentTarget.value
				       }}
				/>
			    </div>
			</div>
			<div className="popdetails">
			    <div className="popdetails-title">组织机构</div>
			    <div className="popdetails-content">
				<Input placeholder="限45字符" maxLength="45"
				       defaultValue={this.buffurCertInfo.organization}
				       onChange={(e) => {
					   this.buffurCertInfo.organization = e.currentTarget.value
				       }}
				/>
			    </div>
			</div>
			<div className="popdetails">
			    <div className="popdetails-title">国家</div>
			    <div className="popdetails-content">
				<Input placeholder="限45字符" maxLength="45" defaultValue={this.buffurCertInfo.country}
				       onChange={(e) => {
					   this.rootCertData.country = e.currentTarget.value
				       }}
				/>
			    </div>
			</div>
			<div className="popdetails-footer">
			    <button className="btn btn-blue" onClick={this.createCA}>确认</button>
			    <div>已有证书？<a onClick={() => {
				$Pop.remove();
				this.importRootCert()
			    }}>直接导入</a></div>
			</div>
		    </div>
		)
	    })
	    window.PopCert = $Pop.id
	}
    }
    importRootCert = () => {//导入根证书
	let urlString = window.location.href
	this.rootCertData = {
	    caPrivateKey: "",//_this.state.caRoot.privateKey,
	    caCert: ""//_this.state.caRoot.reqCert,
	};
	this.importCA = () => {
	    let _this = this;
	    if (Util.isEmpty(_this.rootCertData.caPrivateKey)) {
		message.warning("私钥不能为空")
	    } else if (Util.isEmpty(_this.rootCertData.caCert)) {
		message.warning("证书不能为空")
	    } else {
		_this.AJAX({
		    url: urlStore.importCA,
		    data: _this.rootCertData
		}).then((data) => {
		    if (data.code === 200 & !Util.isEmpty(data.data)) {
			message.success("导入成功").then(() => {
			    $pop1.remove();
			    if (urlString.indexOf("rootcert") != "-1") {
				location.reload();
			    }
			})
			window.PopCert = "";
		    } else {
			if (data.msg.code === "RootCertAlreadyExists") {
			    $pop1.remove();
			    window.PopCert = "";
			}
		    }
		})
	    }
	}
	let $pop1 = Pop.hint({
		title: "生成根证书",
		width: "350px",
		showCancel: false,
		showOk: false,
		showFooter: false,
		closeIcon: false,
		content: (
		    <div className="showpopdetails">
			<div className="ovpopdetails">
			    <div className="popdetails-title">私钥</div>
			    <div className="popdetails-content">
							<TextArea placeholder='---请输入---'
								  autosize={{minRows: 6, maxRows: 6}}
								  onChange={(e) => {
								      this.rootCertData.caPrivateKey = e.currentTarget.value
								  }}
							/>
			    </div>
			</div>
			<div className="ovpopdetails">
			    <div className="popdetails-title">证书</div>
			    <div className="popdetails-content">
							<TextArea placeholder='---请输入---'
								  autosize={{minRows: 6, maxRows: 6}}
								  onChange={(e) => {
								      this.rootCertData.caCert = e.currentTarget.value
								  }}
							/>
			    </div>
			</div>
			<div className="popdetails-footer">
			    <button className="btn btn-opacity" onClick={() => {
				$pop1.remove();
				window.PopCert = "";
				this.setRootCert();
			    }}>返回
			    </button>
			    <button className="btn btn-blue" onClick={() => {
				this.importCA();
			    }}>导入
			    </button>
			</div>
		    </div>
		)
	    }
	)
    }
    getUrlPath = () => {
	if (typeof window !== "undefined") {
	    let href = window.location.href.split("?")[0];
	    let hrefArr = href.split("/");
	    return `${hrefArr[hrefArr.length - 1]}`;
	} else {
	    return ``;
	}
    };
    parseUrl = (url) => {
	return url
	.substring(url.indexOf('?') + 1)
	.split('&')
	.map((query) => query.split('='))
	.reduce((params, pairs) => (params[pairs[0]] = pairs[1] || '', params), {});
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
 * 管理系统主结构
 */
@inject('store') @observer
class MainBody extends BaseApp {
    constructor(props) {
	super(props);
	const {store: {userStore: {setUserData}}} = this.props;
	let strData = Cookie.get("userDataMG");
	let passData = Cookie.get("sureChangePass");
	if (!Util.isEmpty(passData) && passData == "true") {
	    this.props.history.push(`/mgmt/changepassword`);
	}
	if (!Util.isEmpty(strData)) {
	    strData = JSON.parse(strData);
	    setUserData(strData);
	} else {
	    strData = ""
	}
	this.userData = strData;
	if (Util.isEmpty(this.userData)) {
	    let fromUrl = window.location.href.split("/mgmt/")[1];
	    this.props.history.push(`/login${!Util.isEmpty(fromUrl) ? `?from=${encodeURIComponent(fromUrl)}` : ''}`);
	}
    }

    componentDidMount = () => {//是否有根证书
	let _this = this;
	let localhostParse = _this.props.history.location.pathname;
	_this.AJAX({
	    url: urlStore.checkCA,
	}).then((data) => {
	    if (data.code === 200 & !Util.isEmpty(data.data)) {
		!data.data.haveCA && _this.userData.actionCodes.indexOf("CA.001") != -1
		&& (localhostParse == "/mgmt/certmanage" || localhostParse == "/mgmt/rootcert" || localhostParse == "/mgmt" || localhostParse == "/mgmt/changepassword") ? _this.setRootCert() : ""
	    } else {

	    }
	})
    }

    render() {
	return (
	    <div style={{height: "100%", width: "100%", overflow: "auto", minWidth: "1300px", minHeight: "600px"}}>
		<Header/>
		{
		    Util.isEmpty(this.userData) ? "" :
			<Content {...this.props}>
			    {
				this.props.children
			    }
			</Content>
		}
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
		<div className="app-logo"/>
		<span style={{fontSize: "20px"}}>梧桐链管理系统</span>
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
	this.userData = !Util.isEmpty(Cookie.get("userDataMG")) ? JSON.parse(Cookie.get("userDataMG")) : "";
	this.static = {}
	this.state = {
	    personalTotal: '',
	    sysTotal: '',
	}
    }

    showInforms = () => {//右侧消息
	let _this = this;
	RightInform.isshow(this.state, () => {
	    _this._number();
	});
    };
    updateInfo = () => {
	const {store: {userStore: {userData}}, history} = this.props;
	if (this.props.history.location.pathname.indexOf("/login") == -1) {
	    let $infoPop = Pop.hint({
		showCancel: false,
		showOk: false,
		showFooter: false,
		title: "修改账号信息",
		width: "400px",
		content: (
		    <div className="showpopdetails">
			<UserInfoPop chanlePop={() => {
			    $infoPop.remove()
			}} history={this.props.history}/>
		    </div>
		)
	    })
	}

    }
    //登出
    logout = () => {
	let _this = this;
	_this.AJAX({
	    url: urlStore.logout
	}).then((data) => {
	    Cookie.remove("userDataMG");
	    Cookie.remove("sureChangePass");
	    _this.props.history.push(`/login`);
	})
    };
    //是否有未读取消息
    _number = () => {
	let _this = this;
	_this.AJAX({
	    url: urlStore.getTotalUnreadCount,
	}).then((data) => {
	    if (data.code === 200 & !Util.isEmpty(data.data)) {
		_this.setState({
		    personalTotal: data.data.personalTotal,
		    sysTotal: data.data.sysTotal
		})
	    } else {

	    }
	})
    }
    componentDidMount = () => {
	let _this = this;
	_this._number()
	// setInterval(function(){_this._number()},10000);//定时刷新消息
    }

    render() {
	const {store: {menuStore}} = this.props;
	return (
	    <div className="app-Content">
		<div className="force-cover-menu"></div>
		<div className="menu-box">
		    <div className="user-head">
			<Popover placement="bottom" content={(
			    <div className="user-option">
				<div onClick={this.showInforms}><span><i className="fa fa-bell-o"/>消息通知</span></div>
				<div onClick={this.updateInfo}><span><i className="fa fa-address-card-o"/>修改账号信息</span>
				</div>
				<div onClick={this.logout}><span><i className="fa fa-power-off"/>退出登录</span></div>
			    </div>
			)} trigger="click">
			    <div style={{textAlign: "center", cursor: "pointer"}}>
				<Badge
				    dot={this.state.personalTotal != 0 || this.state.personalTotal != 0 ? true : false}>
				    <FontAwesome name="user-circle" size="3x"/>
				</Badge>
				<div style={{
				    width: "100%",
				    marginTop: "5px"
				}}>{Util.isEmpty(this.userData.accountInfo) ? "" : this.userData.accountInfo.name}</div>
			    </div>
			</Popover>
		    </div>
		    <div className="menu-container">
			<CakeMenu menuData={menuStore.menuData} {...this.props} updateInforms={this._number}/>
		    </div>
		</div>
		<div className="main-body">
		    {
			this.props.children
		    }
		    <div className="console-footer">Copyright&copy;2018苏州同济区块链研究院</div>
		</div>
	    </div>
	)
    }
}

class UserInfoPop extends BaseApp {
    constructor(props) {
	super(props);
	this.userData = !Util.isEmpty(Cookie.get("userDataMG")) ? JSON.parse(Cookie.get("userDataMG")) : "";
	this.static = {
	    updateInfo: {},
	    newPassword: "",
	    oldPassword: "",
	    sureNewPassword: ""
	}
	this.state = {
	    updateInfo: {},
	    showUpdatePassword: false
	}
    }

    changeShow = () => {
	this.state.showUpdatePassword ?
	    this.setState({showUpdatePassword: false}) :
	    this.setState({showUpdatePassword: true})
    }
    //修改账户信息调接口
    updateInfoAjax = () => {
	let _this = this;
	let data = {};
	_this.state.showUpdatePassword ?
	    data = Object.assign({
		oldPassword: _this.static.oldPassword,
		newPassword: _this.static.newPassword
	    }, _this.static.updateInfo)
	    : data = Object.assign({oldPassword: "", newPassword: ""}, _this.static.updateInfo)
	_this.AJAX({
	    url: urlStore.updateInfo,
	    data: data,
	}).then((data) => {
	    if (data.code === 200 & !Util.isEmpty(data.data)) {
		message.success("修改成功", 2).then(() => {
		    this.props.chanlePop();
		    if (_this.state.showUpdatePassword) {
			let fromUrl = window.location.href.split("/mgmt/")[1];
			const {history} = _this.props;
			Pop.alert("会话失效，请重新登录", () => {
			    if (history.location.pathname !== "/login") {
				history.push(`/login${!Util.isEmpty(fromUrl) ? `?from=${encodeURIComponent(fromUrl)}` : ''}`);
			    }
			});
		    } else {
			this.props.chanlePop();
		    }
		});
	    } else {

	    }
	})
    }
    //判断修改账户信息内容
    sureUpdateInfo = () => {
	let _this = this;
	let detailDate = _this.static.updateInfo;
	let contrastDate = _this.state.updateInfo;
	// console.log(detailDate,contrastDate)
	let reg1 = /^[A-Za-z0-9_.-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	let reg2 = /^1\d{10}$/;
	if (Util.isEmpty(detailDate.email)) {
	    message.warning("邮箱不能为空");
	} else if (reg1.test(detailDate.email) == false) {
	    message.warning("邮箱格式不正确");
	} else if (Util.isEmpty(detailDate.mobile)) {
	    message.warning("手机号不能为空");
	} else if (reg2.test(detailDate.mobile) == false) {
	    message.warning("手机号格式不正确");
	} else if (Util.isEmpty(detailDate.org)) {
	    message.warning("组织机构不能为空");
	} else if (_this.state.showUpdatePassword) {
	    if (Util.isEmpty(_this.static.oldPassword)) {
		message.warning("原密码不能为空");
	    } else if (Util.isEmpty(_this.static.newPassword)) {
		message.warning("新密码不能为空");
	    } else if (_this.static.newPassword.length < 6 || _this.static.newPassword.length > 18) {
		message.warning("新密码限6-18字符");
	    } else if (Util.isEmpty(_this.static.sureNewPassword)) {
		message.warning("确认新密码不能为空");
	    } else if (_this.static.sureNewPassword != _this.static.newPassword) {
		message.warning("新密码不一致");
	    } else {
		_this.updateInfoAjax();
	    }
	} else if (detailDate.email == contrastDate.email && detailDate.mobile == contrastDate.mobile && detailDate.org == contrastDate.org && !_this.state.showUpdatePassword) {
	    message.warning("未修改任何账号信息")
	} else {
	    _this.updateInfoAjax()
	}
    }
    componentWillMount = () => {//获取用户详情
	let _this = this;
	_this.AJAX({
	    url: urlStore.getUserData
	}).then((data) => {
	    if (data.code === 200 & !Util.isEmpty(data.data)) {
		this.static.updateInfo = Object.assign({}, data.data)
		this.setState({
		    updateInfo: data.data
		})
	    } else {

	    }
	})

    }

    render() {
	let detailData = this.static.updateInfo;
	let roleString = {"M": "管理员", "U": "用户"};
	let dataInfo = this.static.updateInfo
	return (
	    <div className="showpopdetails">
		<div className="popdetails">
		    <div className="popdetails-title">账号</div>
		    <div className="popdetails-content">{Util.isEmpty(detailData.name) ? "-" : detailData.name}</div>
		</div>
		<div className="popdetails">
		    <div className="popdetails-title">角色</div>
		    <div
			className="popdetails-content">{Util.isEmpty(detailData.role) ? "-" : roleString[detailData.role]}</div>
		</div>
		<div className="popdetails">
		    <div className="popdetails-title">邮箱</div>
		    <div className="popdetails-content">
			<Input maxLength="128" placeholder="---请输入---" defaultValue={detailData.email}
			       onChange={(e) => {
				   dataInfo.email = e.currentTarget.value
			       }}
			/>
		    </div>
		</div>
		<div className="popdetails">
		    <div className="popdetails-title">手机号</div>
		    <div className="popdetails-content">
			<Input maxLength="45" placeholder="---请输入---" defaultValue={detailData.mobile}
			       onChange={(e) => {
				   dataInfo.mobile = e.currentTarget.value
			       }}
			/>
		    </div>
		</div>
		<div className="popdetails">
		    <div className="popdetails-title">组织机构</div>
		    <div className="popdetails-content">
			<Input maxLength="40" placeholder="---请输入---" defaultValue={detailData.org}
			       onChange={(e) => {
				   dataInfo.org = e.currentTarget.value
			       }}
			/>
		    </div>
		</div>

		<div className="popdetails-mark">
		    {this.state.showUpdatePassword ?
			<a onClick={this.changeShow}>取消修改密码？</a>
			:
			<a onClick={this.changeShow}>修改密码？</a>
		    }
		</div>
		<div style={{display: this.state.showUpdatePassword ? "block" : "none"}}>
		    <div className="popdetails">
			<div className="popdetails-title">原密码</div>
			<div className="popdetails-content">
			    <Input placeholder="---请输入---" type="password" maxLength="18" minLength="6"
				   onChange={(e) => {
				       this.static.oldPassword = e.currentTarget.value
				   }}
			    />
			</div>
		    </div>
		    <div className="popdetails">
			<div className="popdetails-title">新密码</div>
			<div className="popdetails-content">
			    <Input placeholder="限6-18字符" type="password" maxLength="18" minLength="6"
				   onChange={(e) => {
				       this.static.newPassword = e.currentTarget.value
				   }}
			    />
			</div>
		    </div>
		    <div className="popdetails">
			<div className="popdetails-title">确认新密码</div>
			<div className="popdetails-content">
			    <Input placeholder="---请输入---" type="password" maxLength="18" minLength="6"
				   onChange={(e) => {
				       this.static.sureNewPassword = e.currentTarget.value
				   }}
			    />
			</div>
		    </div>
		</div>

		<div className="popdetails-footer">
		    <button className="btn btn-opacity" onClick={this.props.chanlePop}>取消</button>
		    <button className="btn btn-blue" onClick={this.sureUpdateInfo}>确认</button>
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

export {BaseApp, MainBody, FromGroup, CakeLoading}
export default BaseApp;
