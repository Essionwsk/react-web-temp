import $ from 'jquery'
import React ,{Component,findDOMNode} from 'react'
import ReactDOM ,{ render } from 'react-dom'
import {Badge } from 'antd'
import urlStore from '../urlStore';
import Util from "../lib/commonJs";
import '../style/systemInform.less'

class RightInform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type:'P',
            width:"400px",
            height:"100%",
            total:1,
            pages:1,
            currentPage:1,
            start:0,
            messages:[],
            content:{},
            personalTotal:0,
            sysTotal:0
        };
        this.idArr=[];
        this.allidArr=[];//获取全部的id
        this.isChangeStatus=false;
        this.thisTime;
        this.showTime;
        Object.assign(this.state,this.props.para);
        //通知列表
        this.getAjax=(type,start,hit)=>{
            var _this=this;
            var listData=[];
            _this.allidArr=[];
            $.ajax({
                url:urlStore.getMessageList,
                type:"post",
                data:{
                    type:type,
                    start:start,
                    hit:hit
                },
                success(data){
                    if(data.code===200 && data.data!=''){
                        _this.setState({
                            messages:data.data.items,
                            total:data.data.total,
                            pages:Math.ceil(data.data.total/8)
                        })
                        for(var i=0;i<data.data.items.length;i++){
                            _this.allidArr[i]=data.data.items[i].id
                        }
                    }else if( data.data==''){
			            // message.warning("暂无数据");
                    }
                },
                error(data){
                    // Pop.mAlert("服务崩溃啦")
                }
            })
        }
        //全部已读
        this.updateAllState=()=>{
            let _this=this;
            if(_this.allidArr.length!=0){
                $.ajax({
                    url:urlStore.updateStatus,
                    type:"post",
                    data:{
                        ids:'',//_this.allidArr
                        status:1,
                        type:_this.state.type
                    },success(data){
                        if(data.code===200){
                            _this.props.callback();
                            _this.getAjax(_this.state.type,0,8);
                            _this._number();
                        }else if(data.data==''){
                            // message.success("状态修改失败")
                        }
                    },
                    error(data){
                        // Pop.mAlert("服务崩溃啦")
                    }
                })
            }
            // if(Util.isEmpty(this.userData)){
            //     if(typeof window !== "undefined"){
            //     if(Util.isEmpty(window.sessionStorage.getItem("userDataCZ"))){
            //         // window.location.href = "/acclogin"
            //     }else{
            //         // console.log("sss")
            //         this.userData = JSON.parse(window.sessionStorage.getItem("userDataCZ"))
            //     }
            //     }
            // }
            // console.log(_this.userData,window.sessionStorage.getItem("userDataCZ"))
        }
        this.perInform=()=>{
            $(".systive").removeClass("active");
            $(".pertive").addClass("active");
            this.setState({
                type:"P"
            })
            this.getAjax("P",0,8);
        }
        //显示系统通知列表的操作
        this.sysInform=()=>{
            $(".pertive").removeClass("active");
            $(".systive").addClass("active");
            this.setState({
                type:"S"
            })
            this.getAjax("S",0,8);
        };
        this.prepage=()=>{
            let _this=this;
            // console.log(_this.state)
            if(_this.state.currentPage<=2){
                $(".prepage").removeClass("active");
                $(".nextpage").addClass("active");
		        // message.warning("已为第一页");
            }else{
                $(".nextpage").addClass("active");}
                var currentPage=Number(_this.state.currentPage)-1;
                var start=Number(_this.state.start)-8;
                _this.setState({
                    currentPage:currentPage,
                    start:start
               }) 
               _this.getAjax(_this.state.type,start,8);
            // console.log(_this.state.currentPage,_this.state.start)
        }
        this.nextpage=()=>{
            let _this=this;
            if(_this.state.pages==_this.state.currentPage || _this.state.pages==0){
                // $(".prepage").addClass("active");
                $(".nextpage").removeClass("active");
		        // message.warning("已为最后一页");
            }else{
                $(".prepage").addClass("active");
                if(_this.state.pages-1==_this.state.currentPage){$(".nextpage").removeClass("active");}
                var currentPage=Number(_this.state.currentPage)+1;
                var start=Number(_this.state.start)+8;
                _this.setState({
                    currentPage:currentPage,
                    start:start
               }) 
               _this.getAjax(_this.state.type,start,8);
            }
            console.log(_this.state)
        }
        //显示通知详细信息的操作
        this.showdetail=(e,id,readed)=>{
            $(e.target).addClass("detailactive");
            // console.log($(this))
            var _this=this;
            _this.isChangeStatus=true;
            if(readed !== 1){
            _this.state.callback?_this.state.callback():"";
            }
            var msgData=[];
            $.ajax({
                url:urlStore.getMessageDetail,
                type:"post",
                data:{
                    id:id
                },
                success(data){
                    if(data.code===200 && data.data!=''){
                        _this.setState({
                            content:data.data
                        })
                        $("#popdetail").css("display","block")
                        // console.log(_this.state.content)
                    }else if( data.data==''){
                        // Pop.mAlert("暂无数据")
                    }
                },
                error(data){
                    // Pop.mAlert("服务崩溃啦")
                }
            })
            if(_this.idArr.indexOf(id)==-1){
                _this.idArr.push(id);
            }
            //将msg的所有状态发给后台，并修改小圆点1和小圆点2
            if(readed==0){
                $.ajax({
                    url:urlStore.updateStatus,
                    type:"post",
                    data:{
                        ids:_this.idArr,
                        status:1,
                        type:_this.state.type
                    },success(data){
                        if(data.code===200){
                            _this.props.callback();
                            _this._number();
                        }else if(data.data==''){
                            // Pop.mAlert("状态修改失败")
                        }
                    },
                    error(data){
                        // Pop.mAlert("服务崩溃啦")
                    }
                })
            }
        };
        this.close=()=>{
            $("#popdetail").css("display","none")
        };
        //隐藏列表的时候将所有的通知状态传给后台
        this.remove = () =>{
            var _this=this;
            let pNode = ReactDOM.findDOMNode(_this.refs.informs).parentNode;
            $(pNode).remove();   
        };
        this.timestyle=(time)=>{
            time=time.replace(/\./g, "\/");
            var timecha=parseInt((new Date().getTime()-new Date(time).getTime())/ (1000*60)).toFixed(0);//分
            var daycha=timecha/60/24;
            // console.log(timecha,daycha)
            if(daycha>=1 && daycha<2){
                return(<div className="infotime" title={time}>昨天</div>)
            }else if(daycha<1 && daycha>=0){
                if(timecha<1){
                    return(<div className="infotime" title={time}>刚刚</div>)
                }else if(timecha>1 && timecha<60){
                    return(<div className="infotime" title={time}>{timecha}分钟前</div>)
                }else if(timecha > 60){
                    return(<div className="infotime" title={time}>{parseInt(timecha/60).toFixed(0)}小时前</div>)
                }
            }else{
                return(<div className="infotime" title={time}>{time}</div>)
            }
        }
        this._number=()=>{
            let _this=this;
            $.ajax({
                url:urlStore.getTotalUnreadCount,
                type:"post",
                success(data){
                    if(data.code === 200 & !Util.isEmpty(data.data)){
                        _this.setState({
                            personalTotal:data.data.personalTotal,
                            sysTotal:data.data.sysTotal
                        })
                        // console.log(_this.state)
                    }else{
        
                    }
                },
                error(data){
                    // Pop.mAlert("服务崩溃啦")
                }
            })
        }
    };
    componentDidMount(){
        //默认ajax加载个人通知的通知
        // console.log( this.userData)
        // var allpages=Math.ceil(this.props.numbermsgs/8);
        var _this=this;
        _this.setState({
            type:"P",
            // total:_this.props.numbermsgs,
            // pages:allpages
        })
        _this._number();//获取未读消息个数
        _this.getAjax("P",0,8);
        this.thisTime=new Date().getTime();
    }
    render() {
        let style = Object.assign({
            width:this.state.width,
	        height:this.state.height
        });
        return (
            <div ref="informs"  className="informsInfo">
                <div className="rightinform" style={style}>
                    <div className="title">
                        <div>
                        <Badge dot={this.state.personalTotal!=0 || this.state.personalTotal!=0?true:false}>
                        <button className="btn-noborder pertive active" onClick={this.perInform}>个人通知</button>
				        </Badge>
                            &nbsp;/&nbsp;
                        <Badge dot={this.state.sysTotal!=0 || this.state.sysTotal!=0?true:false}>
                        <button className="btn-noborder systive" onClick={this.sysInform}>系统通知</button>
                        </Badge> 
                            
                        </div>
                        <button className="btn btn-opacity" onClick={this.updateAllState}>全部已读</button>
                    </div>
                    {
                        this.state.messages==''?(
                            <div className="isnull">暂无数据</div>
                        ):(
                            this.state.messages.map((value,i)=>{
                                return(
                                    <div className="content" key={i}>
                                        <div className="contenttitle">
                                            <div className="maintitle">
                                                <span className="dian"></span>
                                                <a title={value.title}>{value.title}</a>
                                            </div>
                                            {this.timestyle(value.created_time)}
                                            {/* <div className="infotime" title={value.created_time}>{value.created_time}</div> */}
                                        </div>
                                        {value.status==1?(
                                            <div className="contenttext">
                                            <a className="a detailactive" onClick={(e)=>{this.showdetail(e,value.id,value.status)}} dangerouslySetInnerHTML={{ __html: value.summary.substr(0,60) + '...' }}></a>
                                        </div>
                                        ):(
                                        <div className="contenttext">
                                            <a className="a" onClick={(e)=>{this.showdetail(e,value.id,value.status)}} dangerouslySetInnerHTML={{ __html: value.summary.substr(0,60) + '...' }}></a>
                                        </div>
                                        )}
                                        
                                    </div>
                                )
                            })
                        )
                    }
                    <div className="rightfooter">
                        <button className="btn-noborder close" onClick={this.remove}>隐藏</button>
                        {this.state.total>8?(
                            <div>
                            <button className="btn-noborder prepage" onClick={this.prepage}>上一页</button>/
                            <button className="btn-noborder nextpage active" onClick={this.nextpage}>下一页</button>
                        </div>
                        ):(
                            ''
                        )} 
                    </div>
                </div>
                <div className="popdetail" id="popdetail">
                    <div className="title">通知详情</div>
                    <div className="content" dangerouslySetInnerHTML={{ __html: this.state.content.content }}>
                        {/* {this.state.content.content} */}
                    </div>
                    <button className="btn btn-blue" onClick={this.close}>关闭</button>
                </div>
            </div>
        )
    }
}
export default {
    isshow:function(numbermsgs,callback){
        let id = parseInt(Math.random()*10000);
        $("body").append(`<div class='sysinforms' data-id='${id}'></div>`);
        let para = {
            width:"400px",
            height:"100%",
        };
        let react = render(<RightInform para={para} numbermsgs={numbermsgs} callback={callback}/>,$(`.sysinforms[data-id='${id}']`)[0]);
        return {
            remove:react._remove
        }
    }
};