import $ from 'jquery'
import React ,{Component , findDOMNode} from 'react'
import ReactDOM ,{ render } from 'react-dom'
import {Icon} from 'antd';
class Pop extends Component {
    constructor(props) {
        super(props);
        let _this = this;
        this.state = {
            hide:false,
            showTitle:true,
            title:"弹出框",
            width:"500px",
            height:"",
            maxHeight:" calc(100% - 50px)",
            maxWidth:"",
            top:null,
            showOk:true,
            okText:"确定",
            okClass:"btn-blue",//btn-primary
            showCancel:true,
            showFooter:true,
            cancelText:"取消",
            cancelClass:"",
            content:"自定义 component",
	    closeIcon:"",
            onLoad:()=>{}
        };

        Object.assign(this.state,this.props.para);

        this.remove = () =>{
            let pNode = ReactDOM.findDOMNode(this.refs.popDialog).parentNode;
            // ReactDOM.unmountComponentAtNode(pNode);
            $(pNode).remove();
        };
        this.popCancel = () =>{
            if($.isFunction(_this.props.cancel)){
                _this.props.cancel();
            }
            _this.remove();
        };
        this.popOk = () =>{
            let remove = true;
            if(_this.props.ok){
                remove = _this.props.ok(ReactDOM.findDOMNode(this.refs.popDialog),this.childComp);
            }
            if(remove === false){

            }else{
                _this.remove();
            }
        };

        this.isMobile = ()=>{
            let u = navigator.userAgent;

            if(!!u.match(/AppleWebKit.*Mobile.*/)){//mobile
                return true
            }
            if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){//ios
                return true
            }
            if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){//android
                return true
            }
            if(u.indexOf('iPhone') > -1){//iPhone
                return true
            }
            return false
        }

    }

    componentWillMount(){

    }
    componentDidMount(){
        let react = null;
        let dom = ReactDOM.findDOMNode(this.refs.popDialog);
        let $popBody = $(dom).find("#popBody");

        if(Object.prototype.toString.call(this.state.content) !== "[object string]"){
            // react = render(this.state.content,document.getElementById("popBody"));
            react = render(this.state.content,$popBody[0]);
        }else{
            $popBody.html(this.state.content)
        }
        this.childComp = react;
        this.state.onLoad(dom,react)
    }

    render(){
        let style = Object.assign({
            height:this.state.height,
            margin: "0 auto",
            // top:this.state.top,
            "maxHeight":this.state.maxHeight,
            "maxWidth":this.state.maxWidth,
        },!this.isMobile()?{
            width:this.state.width,
        }:{});
        let okStyle = this.state.okClass === ""?"btn-violet":this.state.okClass;
        let cancelStyle = this.state.cancelClass === ""?"btn-opacity":this.state.cancelClass;
        return(
            <div className="pop-dialog" style={style} ref="popDialog">
                {
                    this.state.showTitle?
                        <div className="pop-dialog-head">
                            {this.state.title}
                            <div style={{cursor:"pointer"}} onClick={this.remove}>
                                {
                                    this.state.closeIcon === ""?<Icon type="close-circle-o" />:this.state.closeIcon
				}
                            </div>
                        </div>:
                        ""
                }
                <div id="popBody" className="pop-dialog-body" ref="popBody">
                    {/*{this.state.content}*/}
                </div>
                {this.state.showFooter?(<div className="pop-dialog-foot">
                    {this.state.showCancel?<button className={"_cancel btn " + cancelStyle} onClick={this.popCancel}>{this.state.cancelText}</button>:""}
                    {this.state.showOk?<button className={"_ok btn " + okStyle} onClick={this.popOk}>{this.state.okText}</button>:""}
                </div>):''}
            </div>
        )
    }
}

class PopSlide extends Component {
    constructor(props) {
	super(props);

	this.state = Object.assign({
	    position:"right",
	    width:"360px",
	    content:"自定义内容"
	},this.props.para)

    }

    _remove = ()=>{
	let dom = ReactDOM.findDOMNode(this.refs.popSlide);
	$(dom).animate(Object.assign(this.state.position==="right"?{
	    right:-parseInt(this.state.width)
	}:{
	    left:-parseInt(this.state.width)
	}),180,()=>{
	    $(dom.parentNode).remove();
        })
    };


    componentDidMount(){
        let _this = this;
	let dom = ReactDOM.findDOMNode(this.refs.popSlide);
	$(dom.parentNode).click((e)=>{
	    if($(e.target).hasClass("pop-slide-mask")){
		_this._remove();
            }
        });
	$(dom).animate(Object.assign(this.state.position==="right"?{
	    right:0
	}:{
	    left:0
        }),300);
    }

    render(){
        let style = Object.assign({
            width:this.state.width
        },this.state.position === "right"?{
            right:-parseInt(this.state.width)
        }:{
            left:-parseInt(this.state.width)
        });
        return (
            <div style={style} className="pop-slide-box" ref="popSlide" >
                {
                    this.state.content
                }
            </div>
        )
    }
}

export default {
    dialog:function (para,ok,cancel) {
        let id = parseInt(Math.random()*10000);
        $("body").append(`<div class="pop-mask" data-id="${id}" style=${para.hide?'display:none':''}></div>`);
        let react = render(<Pop para={para} ok={ok} cancel={cancel} />,$(`.pop-mask[data-id='${id}']`)[0]);
        let $pop = $(`.pop-mask[data-id=${id}]`);
        return {
            remove:react.remove,
            hide:()=>{$pop.hide();},
            show:()=>{$pop.show();}
        }
    },
    alert:function (msg,callback) {
        let id = parseInt(Math.random()*10000);
        $("body").append(`<div class="pop-mask" data-id="${id}"></div>`);
        let para = {
            showTitle:false,
            width:"300px",
            height:"",
            top:"20%",
            okText:"关闭",
            okClass:"btn-opacity",
            showCancel:false,
            content:<div className="alert-msg">{msg}</div> ,
        };
        let react = render(<Pop para={para} ok={callback} />,$(`.pop-mask[data-id='${id}']`)[0]);
        return {
            remove:react.remove,
            id:id
        }
    },
    confirm:function (msg, ok, cancel) {
        let id = parseInt(Math.random()*10000);
        $("body").append(`<div class="pop-mask" data-id="${id}"></div>`);
        let para = {
            width:"350px",
            title:"提示",
            top:"20%",
            okText:"确定",
            content:<div className="alert-msg">{msg}</div> ,
        };
        let react = render(<Pop para={para} ok={ok} cancel={cancel}/>,$(`.pop-mask[data-id='${id}']`)[0]);
        return {
            remove:react.remove,
	    id:id
        }
    },
    certAlert:function (para,close) {
	let id = parseInt(Math.random()*10000);
	$("body").append(`<div class="pop-mask" data-id="${id}"></div>`);
	let finalPara = Object.assign({
	    width:"450px",
	    title:"提示",
	    top:"20%",
	    okText:"确定",
	    content:<div className="alert-msg">{para.msg}</div> ,
	    showFooter:false,
	    // closeIcon:"x"
	},para);
	let react = render(<Pop para={finalPara} ok={close} cancel={close}/>,$(`.pop-mask[data-id='${id}']`)[0]);
	return {
	    remove:react.remove,
	    id:id
	}
    },
    slide:function (para) {
	let id = parseInt(Math.random()*10000);
	$("body").append(`<div class="pop-slide-mask" data-id="${id}"></div>`);
	let react = render(<PopSlide para={para} />,$(`.pop-slide-mask[data-id='${id}']`)[0]);
	return {
	    remove:react._remove
	}
    },
    hint:function(para,ok,cancel){
        let id = parseInt(Math.random()*10000);
        $("body").append(`<div class="pop-mask" data-id="${id}"></div>`);
        // let para = {
        //     showTitle:true,
        //     width:"300px",
        //     height:"",
        //     top:"20%",
        //     title:title,
        //     showCancel:false,
        //     showOk:false,
        //     // content:<div className="alert-msg">{msg}</div> ,
        // };
        let react = render(<Pop para={para} ok={ok} cancel={cancel}/>,$(`.pop-mask[data-id='${id}']`)[0]);
        return {
            remove:react.remove,
            id:id
        }
    }
};
