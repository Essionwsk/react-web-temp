import React, {Component} from 'react'
import ReactDOM, {render} from 'react-dom'
import {Icon} from 'antd';

class Pop extends Component {
    constructor(props) {
        super(props);
        let _this = this;

        this.$$popDialog = React.createRef();
        this.$$popBody = React.createRef();


        this.state = {
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
            onLoad: () => {

            }
        };

        Object.assign(this.state, this.props.para);

        this.remove = () => {
            let $container = this.$$popDialog.current.parentNode;
            let $body = $container.parentNode;
            ReactDOM.unmountComponentAtNode($container);
            $body.removeChild($container)
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
            _this.props.ok(_this.$$popDialog);
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

    componentWillUnmount() {

    }

    componentDidMount() {
        this.state.onLoad(this.$$popDialog.current)
    }

    render() {
        let style = Object.assign({
            height: this.state.height,
            margin: "0 auto",
            // top:this.state.top,
            "maxHeight": this.state.maxHeight,
            "maxWidth": this.state.maxWidth,
        }, !this._isMobile() ? {
            width: this.state.width,
        } : {});
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
                    isNotText?
                        <div id="popBody" className="pop-dialog-body" ref={this.$$popBody} >{this.state.content}</div>:
                        <div id="popBody" className="pop-dialog-body" ref={this.$$popBody} dangerouslySetInnerHTML={{__html:this.state.content}} />
                }
                {this.state.showFooter ? (<div className="pop-dialog-foot">
                    {this.state.showCancel ? <button className={"_cancel btn " + cancelStyle}
                                                     onClick={this._popCancel}>{this.state.cancelText}</button> : ""}
                    {this.state.showOk ?
                        <button className={"_ok btn " + okStyle} onClick={this._popOk}>{this.state.okText}</button> : ""}
                </div>) : ''}
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
    return popMask
};

export default {
    dialog:(para, ok, cancel)=>{
        let $popMask = createMask();
        let react = render(<Pop para={para} ok={ok} cancel={cancel}/>,$popMask);
        return {
            remove: react.remove
        }
    },
    alert: function (msg, callback) {
        let $popMask = createMask();
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
        let react = render(<Pop para={para} ok={callback}/>,$popMask);
        return {
            remove: react.remove
        }
    },
    confirm: function (msg, ok, cancel) {
        let $popMask = createMask();
        let para = {
            width: "350px",
            title: "提示",
            top: "20%",
            okText: "确定",
            content: <div className="alert-msg">{msg}</div>,
        };
        let react = render(<Pop para={para} ok={ok} cancel={cancel}/>,$popMask);
        return {
            remove: react.remove
        }
    }
};
