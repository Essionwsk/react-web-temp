import { observable , action } from 'mobx';
import Cookie from 'js-cookie';

let store = null;

class Store {

    @observable userData = {};
    @action setUserData = (data)=>{
	this.userData = data;
    };

}
export default store === null?new Store():store;
