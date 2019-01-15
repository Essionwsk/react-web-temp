import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'
import Cookies from 'js-cookie'
import Util from '../lib/commonJs'
import { config } from '../../config'

import { MainBody } from '../component/BaseApp';
import Login from '../component/Login';
import Overview from '../component/Overview';

import CertManage from '../component/CAManage/CertManage';
import ApplyNewcert from '../component/CAManage/ApplyNewcert';
import RootCert from '../component/CAManage/RootCert';

import PeerList from '../component/PeerManage/PeerManageIndex';
import PeerDetail from '../component/PeerManage/PeerDetail';
import PeerSetting from '../component/PeerManage/PeerSetting';
import PeerAllocationIndex from '../component/PeerManage/PeerAllocationIndex';

import BlockOverviewIndex from '../component/BlockOverview/BlockOverviewIndex';
import BlockPublicity from '../component/BlockOverview/BlockPublicity';
import DealPublicity from '../component/BlockOverview/DealPublicity';
import BlockDetail from '../component/BlockOverview/BlockDetail';
import DealDetail from '../component/BlockOverview/DealDetail';

import TokenManage from '../component/UtxoManage/TokenManage';
import AddAddress from '../component/UtxoManage/AddAddress';
import TokentypeManage from '../component/UtxoManage/TokentypeManage';
import CollectAddress from '../component/UtxoManage/CollectAddress';
import Logs from '../component/Console/Logs';
import ChangePassword from '../component/ChangePassword';
import AccManage from '../component/AccManage/AccManage';
import AddAccount from '../component/AccManage/AddAccount';

import * as stores from '../store/index';

import { BrowserRouter, HashRouter , Switch, Route , Redirect} from 'react-router-dom'

import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';

import '../lib/awesome/css/font-awesome.min.css';
import '../style/base.less';
import '../style/pop.less';
import '../style/console.less';

let __components__ = [
    {
        key:"certManage",
	path:"/mgmt/certmanage",
	component:CertManage
    },{
	key:"applyNewCert",
	path:"/mgmt/certmanage/applynewcert",
	component:ApplyNewcert
    },{
	key:"accManage",
	path:"/mgmt/accmanage",
	component:AccManage
    },{
	key:"addAccount",
	path:"/mgmt/accmanage/addaccount",
	component:AddAccount
    },{
	key:"rootCert",
	path:"/mgmt/rootcert",
	component:RootCert
    },{
	key:"peerList",
	path:"/mgmt/peerlist",
	component:PeerList
    },{
	key:"peerDetail",
	path:"/mgmt/peerlist/:id/detail",
	component:PeerDetail
    },{
	key:"peerSetting",
	path:"/mgmt/peerlist/:id/setting",
	component:PeerSetting
    },{
	key:"peerAllocationIndex",
	path:"/mgmt/peerallocation",
	component:PeerAllocationIndex
    },{
	key:"blockOverviewIndex",
	path:"/mgmt/blockoverview",
	component:BlockOverviewIndex
    },{
	key:"blockPublicity",
	path:"/mgmt/blockoverview/blockpublicity",
	component:BlockPublicity
    },{
	key:"dealPublicity",
	path:"/mgmt/blockoverview/dealpublicity",
	component:DealPublicity
    },{
	key:"blockDetail",
	path:"/mgmt/blockoverview/:hash/blockdetail",
	component:BlockDetail
    },{
		key:"blockTwoDetail",
		path:"/mgmt/blockoverview/:hash/blocktwodetail",
		component:BlockDetail
	},{
	key:"dealDetail",
	path:"/mgmt/blockoverview/:hash/dealdetail",
	component:DealDetail
    },{
	key:"tokenManage",
	path:"/mgmt/tokenmanage",
	component:TokenManage
    },{
	key:"tokenAddAddress",
	path:"/mgmt/tokenmanage/addaddress",
	component:AddAddress
    },{
	key:"tokenTypeManage",
	path:"/mgmt/tokentypemanage",
	component:TokentypeManage
    },{
	key:"collectAddress",
	path:"/mgmt/collectaddressmanage",
	component:CollectAddress
    },{
	key:"collectAddAddress",
	path:"/mgmt/collectaddressmanage/addaddress",
	component:AddAddress
    },{
	key:"updateAddress",
	path:"/mgmt/collectaddressmanage/:id/updateaddress",
	component:AddAddress
    },{
	key:"changePassword",
	path:"/mgmt/changepassword",
	component:ChangePassword
    },{
		key:"logs",
		path:"/mgmt/logs",
		component:Logs
	}
];

ReactDOM.render(
    <BrowserRouter>
	<Provider store={stores}>
	    <Switch>
		<Route path="/login" component={Login}/>
		<Route path="/mgmt" render={({history,location,match}) => (
		    <LocaleProvider locale={zhCN}>
			<MainBody history={history} location={location} match={location}>
			    <Route exact path="/mgmt" component={Overview}/>
			    {
			        __components__.map((n,i)=>{
			            if(config.module.indexOf(n.key) !== -1){
					return <Route key={n.key} exact path={n.path} component={n.component}/>
				    }
				})
			    }
			    {/*<Route exact path="/mgmt/certmanage" component={CertManage}/>
			    <Route exact path="/mgmt/certmanage/applynewcert" component={ApplyNewcert}/>
			    <Route exact path="/mgmt/accmanage" component={AccManage}/>
			    <Route exact path="/mgmt/accmanage/addaccount" component={AddAccount}/>
			    <Route exact path="/mgmt/rootcert" component={RootCert}/>
			    <Route exact path="/mgmt/peerlist" component={PeerList}/>
			    <Route exact path="/mgmt/peerlist/:id/detail" component={PeerDetail}/>
			    <Route exact path="/mgmt/peerlist/:id/setting" component={PeerSetting}/>
			    <Route exact path="/mgmt/peerallocation" component={PeerAllocationIndex}/>
			    <Route exact path="/mgmt/blockoverview" component={blockOverviewIndex}/>
			    <Route exact path="/mgmt/blockoverview/blockpublicity" component={blockPublicity}/>
			    <Route exact path="/mgmt/blockoverview/dealpublicity" component={dealPublicity}/>
			    <Route exact path="/mgmt/blockoverview/:hash/blockdetail" component={blockDetail}/>
			    <Route exact path="/mgmt/blockoverview/:hash/dealdetail" component={dealDetail}/>
			    <Route exact path="/mgmt/tokenmanage" component={TokenManage}/>
			    <Route exact path="/mgmt/tokenmanage/addaddress" component={AddAddress}/>
			    <Route exact path="/mgmt/tokentypemanage" component={TokentypeManage}/>
			    <Route exact path="/mgmt/collectaddressmanage" component={CollectAddress}/>
			    <Route exact path="/mgmt/collectaddressmanage/addaddress" component={AddAddress}/>
			    <Route exact path="/mgmt/collectaddressmanage/:id/updateaddress" component={AddAddress}/>
			    <Route exact path="/mgmt/changepassword" component={ChangePassword}/>*/}
			</MainBody>
		    </LocaleProvider>
		)} />
		<Redirect to="/mgmt"/>
	    </Switch>
	</Provider>
    </BrowserRouter>
    , document.getElementById('app')
);
