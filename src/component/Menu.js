import React from 'react';
import $ from 'jquery';
import Util from '../lib/commonJs';
import { Link } from 'react-router-dom'
import { Popover , Icon } from 'antd'
import '../style/cakeMenu.less';
import { inject , observer } from "mobx-react";
import { toJS } from "mobx";
import Cookie from "js-cookie";

@inject('store') @observer
class CakeMenu extends React.Component {
    constructor(props) {
        super(props);
	const { store:{ menuStore:{ setMenuData } } , history } = this.props;
        this.state = {
            levelPadding:"",
            minMenu:false
        };
        this.static = {
            doing:false,
	    blockExplorerUrl:"",
	    menuCode:{
                "MCA":{
                    text:"CA管理系统",
		    icon:"code-o"
		},
		"MCA.01":{
		    text:"证书管理",
		    page:"certmanage"
		},
		"MCA.02":{
		    text:"CA根证书",
		    page:"rootcert"
		},
		"MNODE":{
		    text:"节点管理系统",
		    icon:"api"
		},
		"MNODE.01":{
		    text:"节点管理",
		    page:"peerlist"
		},
		"MNODE.02":{
		    text:"节点分配",
		    page:"peerallocation"
		},
		"MNODE.03":{
			text:"查询区块",
			page:"blockoverview"
		},
		"MUTXO":{
		    text:"UTXO地址管理",
		    icon:"profile"
		},
		"MUTXO.01":{
		    text:"Token地址管理",
		    page:"tokenmanage"
		},
		"MUTXO.02":{
		    text:"归集地址管理",
		    page:"collectaddressmanage"
		},
		"MUTXO.03":{
		    text:"Token Type管理",
		    page:"tokentypemanage"
		},
		"MUM":{
		    text:"账号管理",
		    icon:"user",
		    page:"accmanage"
		},
		"MLOG":{
			text:"日志查看",
		    icon:"profile",
		    page:"logs"
		},"MData":{
			text:"大屏展示",
			icon:"bar-chart",
		},
	    }
        };


        let userInfo = Cookie.get('userDataMG');
        if(!Util.isEmpty(userInfo)){
	    userInfo = JSON.parse(userInfo);
	    this.static.blockExplorerUrl = userInfo.datavUrl;
	    setMenuData(userInfo.menus);
	    this._makeMenuData();
	}
    }

    /***
     * 生成菜数据
     *  {
     *      text:"[string]菜单名",
     *      page:"[string]模块页名",
     *      icon:"[string]icon",
     *      $index:"[int]同级菜单下标",
     *      open:"[boolean]菜单开合状态",
     *      level:"[int]菜单级别",
     *      children:"[array]子模块",
     *      active:"[boolean]选中",
     *  }
     */
    _makeMenuData = ()=>{
        let _this = this;
	const { store:{ menuStore:{ menuData , setMenuData } } } = this.props;

	let makeData = (itemData,level,group)=>{
	    let _group = Util.isEmpty(group)?0:group;
	    let item = [];
	    itemData.map((n,i)=>{
		_group++;
		Object.assign(n,_this.static.menuCode[n.code]);
		let hasChild = typeof n.children !== 'undefined'&&n.children.length>0;
		n["text"] = Util.isEmpty(n.text)?"":n.text;
		n["page"] = Util.isEmpty(n.page)?"":n.page;
		n["icon"] = Util.isEmpty(n.icon)?"":n.icon;
		n["$index"] = i;
		n["open"] = Util.isEmpty(n.open)?true:n.open;
		n["level"] = level;
		n["active"] = false;
		if(hasChild){
		    n["children"] = makeData(n.children,level+1,_group);
		}else{
		    n["children"] = [];
		}
		item.push(n)
	    });
	    return item;
	};
	let finalMenuData = makeData(toJS(menuData),0);
	setMenuData(finalMenuData);
	return finalMenuData;
    };
    /***
     * 菜单收缩
     * @param itemData
     * @param $index
     * @param event
     * @private
     */
    _flexGroup = (itemData,$index,event)=>{
	const { store:{ menuStore:{ menuData } } } = this.props;
        let $thisItem = $(event.currentTarget);
        let group = $thisItem.attr("data-group");
        if(!this.static.doing){
            this.static.doing = true;
            let $childBox = $thisItem.siblings(`div[data-group='${group}']`);
            if(itemData.open){
		itemData["style_height"] = $childBox.height();
                $childBox.animate({
                    height:0
                },300,()=>{
		    menuData[$index].open = false;
                    $childBox.hide();
                    this.static.doing = false;
                });
            }else{
                $childBox.show();
                $childBox.animate({
                    height:itemData.style_height
                },300,()=>{
                    $childBox.height("auto");
		    menuData[$index].open = true;
                    this.static.doing = false;
                });
            }
        }
    };
    /***
     * 菜单单击事件
     * @param itemData  被单击的菜单数据
     * @param $index     下标
     * @param event     事件
     * @private
     */
    _itemClick = (itemData,$index,event)=>{
	const { store:{ menuStore:{ menuData } } , history , menuClick , location } = this.props;
        let _this = this;
        if(!Util.isEmpty(itemData.page)){
	    if(!itemData.active){
		_this._unActive(menuData);
		itemData.active = true;
		history.push(`/mgmt/${itemData.page}`);
	    }else{
	        if(location.pathname !== `/mgmt/${itemData.page}`){
		    history.push(`/mgmt/${itemData.page}`);
		}else{
		    window.location.reload(false);
		}
		}
		_this.props.updateInforms()//刷新消息数
	}
	if(itemData.code === "MData" && !Util.isEmpty(this.static.blockExplorerUrl)){
	    window.open(this.static.blockExplorerUrl);
	}
        !Util.isEmpty(menuClick)?menuClick(itemData,event,menuData):"";
    };
    /***
     * 取消全部 active 的菜单
     * @param menuData
     * @private
     */
    _unActive = (menuData)=>{
        let _this = this;
        if(!Util.isEmpty(menuData)){
	    menuData.map((n)=>{
		n.active = false;
		if(!Util.isEmpty(n.children)){
		    _this._unActive(n.children);
		}
	    })
	}
    };
    /***
     * 指定需要选中的菜单/模块
     * @param data  菜单数据
     * @param act   指定菜单
     * @returns {*}
     * @private
     */
    _deepAct = (data,act)=>{
        if(data.length>0){
            for(let i=0;i<data.length;i++){
                data[i]["active"] = data[i].page === act;
                if(!Util.isEmpty(data[i].children)){
                    this._deepAct(data[i].children,act);
                }
            }
            return data
        }
    };
    /***
     * 获取当前url地址所在模块
     * @returns {string}
     * @private
     */
    _getUrlPath = ()=>{
        if(typeof window !== "undefined"){
            let href = window.location.href.split("?")[0];
            let hrefArr = href.split("/");
            return hrefArr[hrefArr.indexOf("mgmt")+1];
        }else{
            return ``;
        }
    };
    /***
     * 生成菜单 版本2
     * @param itemData
     * @param group
     * @returns {Array}
     * @private
     */
    _makeItem = (itemData,group)=>{
	let _this = this;
	let __this = [];
	let _group = Util.isEmpty(group)?0:group;
	itemData.map((n,i)=>{
	    const { text , page , icon , $index , open , children , level , active } = n;
	    _group++;
	    let hasChild = !Util.isEmpty(children);
	    __this.push(
		_this._minMenuPopover(
		    <div
			key={i}
			data-group={`group-${_group}`}
			className={`cake-menu-item level-${level} ${active?'active':''}`}
			onClick={
			    hasChild?
				this._flexGroup.bind(this,n,i):
				this._itemClick.bind(this,n,i)
			}
		    >
			<div className="menu-middle-controller">
			    <div className="icon-body">
				{
				    Util.isEmpty(icon)?"":<Icon type={icon} />
				}
			    </div>
			    <div className="item-text">
				{
				    !Util.isEmpty(this.props.cosItem)?this.props.cosItem(n):(
					Util.isEmpty(page)?text:
					    [
						text,
						<Link to={"/"+page} key={page} onClick={e=>e.stopPropagation()}/>
					    ]
				    )
				}
			    </div>
			    <div className="menu-arrow">
				{
				    hasChild?(
					open?<Icon type="minus"/>:<Icon type="plus"/>
				    ):""
				}
			    </div>
			    {
				active?<div className="menu-in" />:""
			    }
			</div>
		    </div>,
		    n
		)
	    );
	    if(hasChild){
		__this.push(
		    <div
			key={i+"-"+level}
			data-group={`group-${_group}`}
			className="cake-menu-item-child-box"
			style={
			    Object.assign(Util.isEmpty(this.state.levelPadding)?{}:{
				paddingLeft:this.state.levelPadding*(level+1)
			    },!open?{
			        height:0,
				display:"none"
			    }:{})
			}
		    >
			{_this._makeItem(children,group)}
		    </div>
		);
	    }
	});
	return __this
    };
    /***
     * 迷你菜单时的选项浮窗
     * @param main
     * @param content
     * @returns {*}
     * @private
     */
    _minMenuPopover = (main,content)=>{
	const { store:{ menuStore:{ menuData , minMenu } } , menuClick } = this.props;
        let _content_ = !Util.isEmpty(content.children)?content.children.map((n,i)=>{
            return (
                <div style={{padding:"2px 0"}} key={i} onClick={()=>{
                    menuData.map((n)=>{
                        n.active = n.text === content.text;
                    });
                    !Util.isEmpty(menuClick)?menuClick(n,null,menuData):"";
                }}>
                    <Link to={"/"+n.page} key={n.page}>
                        { n.text }
                    </Link>
                </div>
            )
        }):"";
        return (
            minMenu?
                <Popover placement="right" content={_content_} trigger="hover" key={Util.uuid()}>
                    { main }
                </Popover>:main
        );
    };
    /***
     * 获取当前菜单所在模块
     * @param menuData
     * @returns {string}
     * @private
     */
    _getActiveItem = (menuData)=>{
        let obj = "";
        function aaa(json) {
            for(let i=0;i<json.length;i++){
                if(json[i].active){
                    obj = json[i]
                }else{
                    if(!Util.isEmpty(json[i].children)){
                        aaa(json[i].children)
                    }
                }
            }
        }
        aaa(menuData);
        return obj
    };
    /***
     * 自动 act 菜单的第一个模块
     * @param data
     * @returns {boolean}
     * @private
     */
    _autoAct = (data)=>{
        for(let i=0;i<data.length;i++){
            if(this.stopAct){
                return false;
            }else{
                if(!Util.isEmpty(data[i].children)){
                    this._autoAct(data[i].children)
                }
                if(!Util.isEmpty(data[i].page)){
		    data[i].active = true;
                    this.stopAct = true;
                    return false;
                }
            }
        }
    };
    /***
     * 当页面刷新时，通过url的状态 使菜单自动选中改有的菜单项
     * @private
     */
    _doActByUrl = ()=>{
	const { store:{ menuStore:{ menuData } } } = this.props;
        let page = this._getUrlPath();
        if(Util.isEmpty(page)){
	    this._unActive(menuData);
            return "";
	}
        let actItem = {};
	let aaa = (data)=>{
	    if(data.length>0){
		for(let i=0;i<data.length;i++){
		    if(data[i]["page"] === page){
			data[i].active = true;
			return false;
		    }
		    if(!Util.isEmpty(data[i].children)){
			aaa(data[i].children);
		    }
		}
	    }
	};
	aaa(menuData);
	return actItem;
    };

    componentDidMount(){
	const {
	    store:{ menuStore : { setMenuData , getMenuData } },
	    history
	} = this.props;

	history.listen((data) => {
	    if(data.pathname === "/"){
		this._unActive(getMenuData());
	    }else{
		this._unActive(getMenuData());
	        this._doActByUrl();
	    }
	});

	let $menuData = window.sessionStorage.getItem("menuData");
	if(!Util.isEmpty($menuData)){
	    let a = JSON.parse($menuData);
	    setMenuData(a);
	    window.sessionStorage.removeItem("menuData");
	}
	/*$(window).on('beforeunload', function (event) {
	    let menuData = toJS(getMenuData());
	    if(!Util.isEmpty(menuData)){
		window.sessionStorage.removeItem("menuData");
		window.sessionStorage.setItem("menuData",JSON.stringify(menuData));
	    }
	});*/
	this._doActByUrl();
    }

    render() {
	const { store:{ menuStore:{ menuData , minMenu } } } = this.props;
        return (
            <div className={`cake-menu ${ minMenu ?'min-menu':''}`}>
                {
                    Util.isEmpty(menuData)?"":this._makeItem(menuData,0)
                }
            </div>
        )
    }
}
export default CakeMenu;
