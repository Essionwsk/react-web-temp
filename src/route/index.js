import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react'
import Cookies from 'js-cookie'

import {MainBody} from '../component/BaseApp';

import * as stores from '../store/index';
import { __components__ } from "./config";

import {BrowserRouter, HashRouter, Switch, Route, Redirect} from 'react-router-dom'

import {ConfigProvider} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';

import '../style/base.less';
import '../style/pop.less';


ReactDOM.render(
    <HashRouter>
        <Provider store={stores}>
            <Switch>
                <Route path="/mgmt" render={({history, location, match}) => (
                    <ConfigProvider locale={zhCN}>
                        <MainBody history={history} location={location} match={location}>
                            {
                                __components__.map((n, i) => {
                                    return <Route key={n.key} exact path={n.path} component={n.component}/>
                                })
                            }
                        </MainBody>
                    </ConfigProvider>
                )}/>
                <Redirect to="/mgmt"/>
            </Switch>
        </Provider>
    </HashRouter>
    , document.getElementById('app')
);
