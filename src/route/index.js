import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'
import Cookies from 'js-cookie'
import Util from '../lib/commonJs'
import { config } from '../../config'

import { MainBody } from '../component/BaseApp';

import * as stores from '../store/index';

import { BrowserRouter, HashRouter , Switch, Route , Redirect} from 'react-router-dom'

import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';

import '../style/base.less';
import '../style/pop.less';


import Page1 from "../component/Page1"
import Page2 from "../component/Page2"

let __components__ = [
    {
        key:"page1",
	path:"/mgmt/page1",
	component:Page1
    },
    {
        key:"page2",
	path:"/mgmt/page2",
	component:Page2
    },
];

ReactDOM.render(
    <BrowserRouter>
	<Provider store={stores}>
	    <Switch>
		<Route path="/mgmt" render={({history,location,match}) => (
		    <LocaleProvider locale={zhCN}>
			<MainBody history={history} location={location} match={location}>
			    {
			        __components__.map((n,i)=>{
				    return <Route key={n.key} exact path={n.path} component={n.component}/>
				})
			    }
			</MainBody>
		    </LocaleProvider>
		)} />
		<Redirect to="/mgmt"/>
	    </Switch>
	</Provider>
    </BrowserRouter>
    , document.getElementById('app')
);
