import React,{ Component } from "react";
import { Button, Row } from "antd"
import { Util, FromGroup } from "tjfoc-react-component"
import {inject, observer} from "mobx-react";
import _request_ from "$component/AxiosStore"
import { config } from "$root/config";
let { _pagination_, _pageSizeOptions_ } = config;
import { userStore } from "$src/store"

import "./page1.less"

@inject('store') @observer
class Example extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.static = {

        };

    }

    render() {
        return (
            <div className="aaa">
                XXX
            </div>
        )
    }
}

export default Example;
