import React, {Component} from 'react'
import ReactDOM, {render} from 'react-dom'
import {Icon, Button} from 'antd';

let __popPool__ = [];

class Pop extends Component {
    constructor(props) {
        super(props);
        let _this = this;

        this.$$popDialog = React.createRef();
        this.$$popBody = React.createRef();

        this.state = {
            key:null,//此弹窗的标识，可以与其他弹窗的key重复，目前主要用于卸载其他组件生成的pop，相同key的弹窗会同时被删除。
            hide: false,
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
            onLoad: () => {

            }
        };

        Object.assign(this.state, this.props.para);

        this.id = this.props.id;
        this.key = this.state.key;

        this.remove = () => {
            let $container = this.$$popDialog.current.parentNode;
            let $body = $container.parentNode;
            ReactDOM.unmountComponentAtNode($container);
            $body.removeChild($container);
            __popPool__.map((n,i)=>{
                if(n.id === this.id){
                    __popPool__.splice(i,1);
                }
            })
        };

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

    _bindKeydown = ()=>{

    };

    componentWillUnmount() {

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

        return (
            <div className="pop-dialog" style={style} ref={this.$$popDialog}>
                {
                    this.state.showTitle ?
                        <div className="pop-dialog-head">
                            {this.state.title}
                            <div style={{cursor: "pointer"}} onClick={this.remove}>
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
        )
    }
}

let createMask = ()=>{
    let id = Math.ceil(Math.random() * 10000).toString();
    let $body = document.getElementsByTagName("body")[0];
    let popMask = document.createElement("div");
    popMask.className = "pop-mask";
    popMask.setAttribute("data-id",id);
    $body.appendChild(popMask);
    return {
        popMask:popMask,
        id:id
    }
};

export default {
    dialog:(para, ok, cancel)=>{
        let maskObj = createMask();
        let react = render(
            <Pop
                para={para}
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
        let react = render(<Pop para={para} ok={callback} id={maskObj.id} />,maskObj.popMask);
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
        let react = render(<Pop para={para} ok={ok} cancel={cancel} id={maskObj.id} />,maskObj.popMask);
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
        let react = render(<Pop para={para} ok={callback} id={maskObj.id} />,maskObj.popMask);
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
        let react = render(<Pop para={para} ok={callback} id={maskObj.id} />,maskObj.popMask);
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
