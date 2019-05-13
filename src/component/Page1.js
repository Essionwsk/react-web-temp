import React from "react";
import BaseApp from "./BaseApp";
import Pop from "./Pop";
import {Button} from "antd"

class Page1 extends BaseApp {
    constructor(props) {
        super(props);
    }

    _showPop = ()=>{
        Pop.dialog({})
    };

    render() {
        return (
            <div>
                页面1
                <Button type="primary" onClick={this._showPop}>弹出框</Button>
            </div>
        )
    }
}

export default Page1;
