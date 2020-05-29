import React, {Component} from "react"
import "react-dom"
import axios from "axios"
import {message, Modal} from "antd"
import { exFun } from "$component/BaseApp";
import moment from "moment"
import {Util} from "tjfoc-react-component"
import {config} from "../../config";

const URL = {
    login: "/mgmt-b/login",

};

/***
 * 统一封装
 * @returns {Promise<any>}
 * @private
 */



let _axios_ = async (option) => {

    let _option = Object.assign({}, {
        method: "get",
        contentType: "application/json",
        autoError: true,
        showLogs: true,
        autoHandle: true,
    }, option);

    return new Promise((suc, err) => {
        axios(_option).then((data) => {
            if (!_option.autoHandle) {
                suc(data);
                return false
            }

            /***
             * 后台数据格式转化标准化
             * @type {any[]}
             */
            let result = [data.data].map(item => {
                item.code = item.State;
                item.data = item.Data;
                item.message = item.Message;
                delete item.State;
                delete item.Data;
                delete item.Message;
                return item;
            });

            suc(data.data);

            if (_option.showLogs === true) {
                /***
                 * 打印被转化后的数据
                 */
                console.log(
                    `%c ${_option.url} ------- ${moment().format("HH:mm:ss")} ----- ${_option.method.toUpperCase()} ----- >> `,
                    'background: #222; color: #bada55',
                    "\n",
                    `参数：`,
                    "\n",
                    _option.data,
                    "\n",
                    "返回：",
                    "\n",
                    result[0],
                    "\n",
                );
            }

            if (result[0].code !== 200 && _option.autoError) {
                message.error(`${result[0].data}`);
                if (result[0].data === "请重新登录") {
                    window.location.href = "#/login"
                }

            }

        }).catch((e) => {
            if (_option.autoError) {
                let obj = document.getElementsByClassName("ant-modal-confirm-error");
                if (obj.length === 0) {
                    Modal.error({
                        title: `Internal Server Error:`,
                        content: (
                            <div>
                                {_option.url}
                                <br/>
                                <br/>
                                {e.toString()}
                            </div>
                        ),
                    });
                }
            }
            suc({
                code: 500,
                data: e
            });
        })
    })
};


export default {
    /***
     * 登录
     * @param username
     * @param password
     * @returns {Promise<any>}
     */
    login: async ({username, password}) => {
        return new Promise((suc, err) => {
            _axios_({
                method: "post",
                url: URL.login,
                data: {
                    accountid: username,
                    password: password,
                }
            }).then((data) => {
                suc(data);
            })
        })
    },

    /***
     * 登出
     * @returns {Promise<any>}
     */
    logout: () => {
        return new Promise((suc, err) => {
            _axios_({
                method: "get",
                url: URL.logout,
            }).then((data) => {
                window.sessionStorage.removeItem(config._userData_);
                suc(data);
            })
        })
    },

};

