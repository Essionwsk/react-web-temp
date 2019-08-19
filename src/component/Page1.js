import React from "react";
import BaseApp from "./BaseApp";
import Pop from "./Pop";
import {Button} from "antd"

class Page1 extends BaseApp {
    constructor(props) {
        super(props);

        this.state = {
            showPop:false
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

                <Pop.PopModal show={this.state.showPop}>
                    ASD
                </Pop.PopModal>

            </div>
        )
    }
}

export default Page1;
