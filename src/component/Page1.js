import React from "react";
import BaseApp from "./BaseApp";
import Pop from "./Pop";
import {Button, Input} from "antd"

class Page1 extends BaseApp {
    constructor(props) {
        super(props);

        this.state = {
            showPop:false,
            loading:false
        }

    }

    _showPop = ()=>{
        this.setState({showPop:true})

        // Pop.dialog({})

    };

    render() {
        return (
            <div>
                页面1
                <Button type="primary" onClick={this._showPop}>弹出框</Button>

                <Pop.PopModal
                    show={this.state.showPop}
                    loading={this.state.loading}
                    ok={()=>{
                        this.setState({loading:true});
                        setTimeout(()=>{
                            this.setState({loading:false})
                        },1500);
                        return false
                    }}
                    cancel={()=>{
                        this.setState({showPop:false});
                    }}
                >
                    <div style={{padding:"20px"}}>
                        你好：<Input style={{width:"200px"}}/>
                    </div>
                </Pop.PopModal>

            </div>
        )
    }
}

export default Page1;
