/***
 * 现在弹窗有两种召唤方式，第一种为原始的方法式召唤 例如：
 * import Pop from "Pop";
 * Pop.dialog({...})
 * 此方法应传统的为传统的js弹窗调用法，优点在于关闭即销毁，不召唤不会增加dom压力，
 * 其缺点在于react的使用中，pop弹窗为独立dom 独立于召唤它的组件，可能会无法感知召唤
 * 它的组件的状态变化如state等，适合场景为数据的单向流动。
 *
 * 第二种为react类型的召唤 例如
 * import Pop from "Pop";
 *  ...
 *  render:()=>{
 *      return (
 *          <Pop.PopModal >
 *               ASD
 *          </Pop.PopModal>
 *      )
 *  }
 *  其优点在于可以感知父组件的state变化，更适合与父组件数据频繁交互的场景
 *  ！确认与取消按钮需要自己上事件来关闭或打开弹窗
 *
 */

import React, {Component} from 'react'
import ReactDOM, {render} from 'react-dom'
import {Icon, Button, Spin} from 'antd';

let __popPool__ = [];

class Pop extends Component {
    constructor(props) {
        super(props);

        this.$$popDialog = React.createRef();
        this.$$popBody = React.createRef();

        this.state = {
            key:null,//此弹窗的标识，可以与其他弹窗的key重复，目前主要用于卸载其他组件生成的pop，相同key的弹窗会同时被删除。
            show:false,
            type:"htmlRender",
            showTitle: true,
            title: "弹出框",
            width: "500px",
            height: "",
            maxHeight: " calc(100% - 50px)",
            maxWidth: "",
            top: null,
            showOk: true,
            okText: "确定",
            okClass: "btn-blue",//btn-primary
            showCancel: true,
            showFooter: true,
            cancelText: "取消",
            cancelClass: "",
            content: "自定义 component",
            closeIcon: "",
            backgroundColor:"",
            loading:false,
            openReInit:true,
            onLoad: () => {

            }
        };

        if(this.state.type === "htmlRender"){
            this.state.content = this.props.children
        }

        this.id = this.props.id;
        this.key = this.state.key;

        this.remove = () => {
            let $container = this.$$popDialog.current.parentNode;
            let $body = $container.parentNode;

            if(this.state.type === "htmlRender"){

            }else{
                ReactDOM.unmountComponentAtNode($container);
                $body.removeChild($container);
                __popPool__.map((n,i)=>{
                    if(n.id === this.id){
                        __popPool__.splice(i,1);
                    }
                })
            }
        };

        this.originalOption = Object.assign(this.state, this.props.para);
    }

    /***
     * 关闭或取消
     * @private
     */
    _popCancel = ()=>{
        let _this = this;
        if(typeof _this.props.cancel === "function"){
            _this.props.cancel();
        }
        _this.remove();
    };
    /***
     * 确认或确定
     * @private
     */
    _popOk = ()=>{
        let _this = this;
        let remove = true;
        if(typeof _this.props.ok === "function"){
            remove = _this.props.ok(_this.$$popDialog);
        }
        if (remove === false) {

        } else {
            _this.remove();
        }
    };

    _isMobile = ()=>{
        let u = navigator.userAgent;

        if (!!u.match(/AppleWebKit.*Mobile.*/)) {//mobile
            return true
        }
        if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {//ios
            return true
        }
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//android
            return true
        }
        if (u.indexOf('iPhone') > -1) {//iPhone
            return true
        }
        return false
    };

    componentWillReceiveProps(nextProps, nextContext) {
        Object.assign(this.state,nextProps);
        this.state.content = nextProps.children;
        if(nextProps.show === true && this.state.openReInit){
            this.state = this.originalOption;
        }
    }

    componentDidMount() {
        this.state.onLoad(this.$$popDialog.current);
        __popPool__.push(this);
    }

    render() {
        let {
            backgroundColor,
            width,
            height,
            maxHeight,
            maxWidth,
        } = this.state;

        backgroundColor = backgroundColor===""?{}:{backgroundColor:backgroundColor};
        width = !this._isMobile() ?{width:width}:{};
        height = height===""?{}:{height:height};
        maxHeight = maxHeight === ""?{}:{maxHeight:maxHeight};
        maxWidth = maxWidth ===""?{}:{maxWidth:maxWidth};

        let style = Object.assign({
            margin: "0 auto",
        },maxWidth,maxHeight,height,width,backgroundColor);

        let okStyle = this.state.okClass === "" ? "btn-violet" : this.state.okClass;
        let cancelStyle = this.state.cancelClass === "" ? "btn-opacity" : this.state.cancelClass;

        let isNotText = Object.prototype.toString.call(this.state.content) !== "[object string]";

        let hide = {
            display:"none"
        };

        return (
            <div className="pop-mask" style={this.state.show?{}:hide} ref={this.$$popDialog}>
                <div className="pop-dialog" style={style} >
                    {
                        this.state.loading?<Spin className="pop-loading" />:""
                    }
                    {
                        this.state.showTitle ?
                            <div className="pop-dialog-head">
                                {this.state.title}
                                <div style={{cursor: "pointer"}} onClick={this._popCancel}>
                                    {
                                        this.state.closeIcon === "" ? <Icon type="close-circle-o"/> : this.state.closeIcon
                                    }
                                </div>
                            </div> :
                            ""
                    }
                    {
                        isNotText ?
                            <div style={{backgroundColor: style.backgroundColor}} id="popBody" className="pop-dialog-body"
                                 ref={this.$$popBody}>{this.state.content}</div> :
                            <div style={{backgroundColor: style.backgroundColor}} id="popBody" className="pop-dialog-body"
                                 ref={this.$$popBody} dangerouslySetInnerHTML={{__html: this.state.content}}/>
                    }
                    {
                        this.state.showFooter ? (
                            <div className="pop-dialog-foot">
                                {this.state.showCancel ? <Button type="default" className={"_cancel btn " + cancelStyle} onClick={this._popCancel}>{this.state.cancelText}</Button> : ""}
                                {this.state.showOk ? <Button type="primary" className={"_ok btn " + okStyle} onClick={this._popOk}>{this.state.okText}</Button> : ""}
                            </div>
                        ) : ''
                    }
                </div>
            </div>
        )
    }
}

let createMask = ()=>{
    let id = Math.ceil(Math.random() * 10000).toString();
    let $body = document.getElementsByTagName("body")[0];
    let popMask = document.createElement("div");
    popMask.className = "pop-mask-box";
    popMask.setAttribute("data-id",id);
    $body.appendChild(popMask);
    return {
        popMask:popMask,
        id:id
    }
};


export default {
    PopModal:Pop,

    dialog:(para, ok, cancel)=>{
        let maskObj = createMask();

        let react = render(
            <Pop
                para={Object.assign({show:true, type:"functionRender",},para)}
                ok={ok}
                cancel={cancel}
                id={maskObj.id}
            />,maskObj.popMask);
        return {
            remove: react?react.remove:""
        }
    },
    alert: function (msg, callback) {
        let maskObj = createMask();
        let para = {
            showTitle: false,
            width: "300px",
            height: "",
            top: "20%",
            okText: "关闭",
            okClass: "btn-opacity",
            showCancel: false,
            content: <div className="alert-msg">{msg}</div>,
        };
        let react = render(<Pop para={Object.assign({show:true, type:"functionRender",},para)} ok={callback} id={maskObj.id} />,maskObj.popMask);
        return {
            remove: react.remove
        }
    },
    confirm: function (msg, ok, cancel) {
        let maskObj = createMask();
        let para = {
            width: "350px",
            title: "提示",
            top: "20%",
            okText: "确定",
            content: <div className="alert-msg">{msg}</div>,
        };
        let react = render(<Pop para={Object.assign({show:true, type:"functionRender",},para)} ok={ok} cancel={cancel} id={maskObj.id} />,maskObj.popMask);
        return {
            remove: react.remove
        }
    },
    warning:function (msg,callback) {
        let maskObj = createMask();
        let para = {
            title:"提示",
            width:"300px",
            height:"",
            top:"20%",
            showCancel:false,
            content:<div className="alert-msg">{msg}</div> ,
        };
        let react = render(<Pop para={Object.assign({show:true, type:"functionRender",},para)} ok={callback} id={maskObj.id} />,maskObj.popMask);
        return {
            remove:react.remove,
            id:maskObj.id
        }
    },
    success:function (msg,callback) {
        let maskObj = createMask();
        let para = {
            title:"提示",
            width:"350px",
            height:"",
            top:"20%",
            showCancel:false,
            content:<div className="alert-msg">
                <Icon type="check-circle" style={{color:"#34CE34",fontSize:"60px",marginBottom:"10px"}}/>
                <p>{msg}</p>
            </div>
        };
        let react = render(<Pop para={Object.assign({show:true, type:"functionRender",},para)} ok={callback} id={maskObj.id} />,maskObj.popMask);
        return {
            remove:react.remove
        }
    },
    /***
     * 通过标识 卸载任意单个或多个弹窗
     * @param key
     */
    remove:function (key) {
        __popPool__.map((n,i)=>{
            if(n.key === key){
                n.remove();
            }
        })
    }
};
