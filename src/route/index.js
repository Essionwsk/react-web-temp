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

let __components__ = [
/*    {
        key:"certManage",
	path:"/mgmt/certmanage",
	component:CertManage
    }*/
]

ReactDOM.render(
    <BrowserRouter>
	<Provider store={stores}>
	    <Switch>
		<Route path="/mgmt" render={({history,location,match}) => (
		    <LocaleProvider locale={zhCN}>
			<MainBody history={history} location={location} match={location}>
			    {
			        __components__.map((n,i)=>{
			            if(config.module.indexOf(n.key) !== -1){
					return <Route key={n.key} exact path={n.path} component={n.component}/>
				    }
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
