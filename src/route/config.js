import React from "react"
import Loadable from "react-loadable"
import { Spin } from "antd"

import Page1 from "../component/page1/Page1"
import Page2 from "../component/Page2"

/*const loadingComponent =()=>{
    return (
        <div style={{width:"100%",height:"100%"}}>
            <Spin />
        </div>
    )
};

const Page1 = Loadable({
    loader:()=>import('../component/Page1'),
    loading: loadingComponent
});
const Page2 = Loadable({
    loader:()=>import('../component/Page2'),
    loading: loadingComponent
});*/

let __components__ = [
    {
        key: "page1",
        path: "/mgmt/page1",
        component: Page1
    },
    {
        key: "page2",
        path: "/mgmt/page2",
        component: Page2
    },
];

export { __components__ };
