import { toJS } from 'mobx';
module.exports = {
    /***
     * 将任意数量对象或者字符串传入该方法，若有任意一个为空，则返回true
     * 可判断 空对象 空数组 空字符串 undefined null
     * @returns {boolean}
     */
    isEmpty: function (){
	let len = arguments.length;
	if(len === 0){ return true; }
	for(let i=0;i<len;i++){
	    let a = arguments[i];
	    if(typeof a === "undefined" || a === null ){
		return true;
	    }
	    if(typeof a.$mobx !== 'undefined'){
		a = toJS(a);
	    }
	    if((typeof a === "string" && a.trim() === "")){
		return true;
	    }else if(typeof a === "object"){
		let flg = true;
		for (let name in a ) {
		    flg = false;
		    break;
		}
		if(flg){ return true; }
	    }
	}

	return false;
    },
    /***
     * uuid 生成
     * @param len
     * @param radix
     * @returns {string}
     */
    uuid:function (len, radix) {
        let CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let chars = CHARS, uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            let r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random()*16;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
    /***
     * 时间格式化
     * @param date
     * @param fmt
     * @returns {*}
     */
    timeFormat:function (date, fmt) {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    /***
     * 终端判断
     * @returns {boolean}
     */
    isMobile:function () {
        let u = navigator.userAgent;
        if(!!u.match(/AppleWebKit.*Mobile.*/)){//mobile
            return true
        }
        if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){//ios
            return true
        }
        if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){//android
            return true
        }
        if(u.indexOf('iPhone') > -1){//iPhone
            return true
        }
        return false
    },
    /***
     * 文本比对
     * @param dom1
     * @param dom2
     */
    compareText:function (dom1,dom2) {
	function MyCompare(dom1,dom2){
	    if(!dom1&&!dom2){
		console.log('参数错误：dom1、dom2不能为空。');
		return;
	    }
	    else if(!dom1){
		//dom1为空：新增
		dom2.style.color = '#90EE90';
	    }else if(!dom2){
		//dom2为空：删除
		dom1.style.color = '#FF6347';
		dom1.style.textDecoration = 'line-through';
	    }else{
		//进行差异比较
		var result = _eq({value1:dom1.innerText||dom1.innerHTML,value2:dom2.innerText||dom2.innerHTML});
		dom1.innerHTML = result.value1;
		dom2.innerHTML = result.value2;
	    }
	}
	function _eq(op) {
	    if(!op){
		return op;
	    }
	    if(!op.value1_style){
		op.value1_style="background-color:#FEC8C8;";
	    }
	    if(!op.value2_style){
		op.value2_style="background-color:#FEC8C8;";
	    }
	    if(!op.eq_min){
		op.eq_min=3;
	    }
	    if(!op.eq_index){
		op.eq_index=5;
	    }
	    if (!op.value1 || !op.value2) {
		return op;
	    }
	    var ps = {
		v1_i: 0,
		v1_new_value: "",
		v2_i: 0,
		v2_new_value: ""
	    };
	    while (ps.v1_i < op.value1.length && ps.v2_i < op.value2.length) {
		if (op.value1[ps.v1_i] == op.value2[ps.v2_i]) {
		    ps.v1_new_value += op.value1[ps.v1_i].replace(/</g,"<").replace(">",">");
		    ps.v2_new_value += op.value2[ps.v2_i].replace(/</g,"<").replace(">",">");
		    ps.v1_i += 1;
		    ps.v2_i += 1;
		    if (ps.v1_i >= op.value1.length) {
			ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i).replace(/</g,"<").replace(">",">") + "</span>";
			break;
		    }
		    if (ps.v2_i >= op.value2.length) {
			ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i).replace(/</g,"<").replace(">",">") + "</span>";
			break;
		    }
		} else {
		    ps.v1_index = ps.v1_i + 1;
		    ps.v1_eq_length = 0;
		    ps.v1_eq_max = 0;
		    ps.v1_start = ps.v1_i + 1;
		    while (ps.v1_index < op.value1.length) {
			if (op.value1[ps.v1_index] == op.value2[ps.v2_i + ps.v1_eq_length]) {
			    ps.v1_eq_length += 1;
			} else if (ps.v1_eq_length > 0) {
			    if (ps.v1_eq_max < ps.v1_eq_length) {
				ps.v1_eq_max = ps.v1_eq_length;
				ps.v1_start = ps.v1_index - ps.v1_eq_length;
			    }
			    ps.v1_eq_length = 0;
			    break;//只寻找最近的
			}
			ps.v1_index += 1;
		    }
		    if (ps.v1_eq_max < ps.v1_eq_length) {
			ps.v1_eq_max = ps.v1_eq_length;
			ps.v1_start = ps.v1_index - ps.v1_eq_length;
		    }

		    ps.v2_index = ps.v2_i + 1;
		    ps.v2_eq_length = 0;
		    ps.v2_eq_max = 0;
		    ps.v2_start = ps.v2_i + 1;
		    while (ps.v2_index < op.value2.length) {
			if (op.value2[ps.v2_index] == op.value1[ps.v1_i + ps.v2_eq_length]) {
			    ps.v2_eq_length += 1;
			} else if (ps.v2_eq_length > 0) {
			    if (ps.v2_eq_max < ps.v2_eq_length) {
				ps.v2_eq_max = ps.v2_eq_length;
				ps.v2_start = ps.v2_index - ps.v2_eq_length;
			    }
			    ps.v1_eq_length = 0;
			    break;//只寻找最近的
			}
			ps.v2_index += 1;
		    }
		    if (ps.v2_eq_max < ps.v2_eq_length) {
			ps.v2_eq_max = ps.v2_eq_length;
			ps.v2_start = ps.v2_index - ps.v2_eq_length;
		    }
		    if (ps.v1_eq_max < op.eq_min && ps.v1_start - ps.v1_i > op.eq_index) {
			ps.v1_eq_max = 0;
		    }
		    if (ps.v2_eq_max < op.eq_min && ps.v2_start - ps.v2_i > op.eq_index) {
			ps.v2_eq_max = 0;
		    }
		    if ((ps.v1_eq_max == 0 && ps.v2_eq_max == 0)) {
			ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1[ps.v1_i].replace(/</g,"<").replace(">",">") + "</span>";
			ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2[ps.v2_i].replace(/</g,"<").replace(">",">") + "</span>";
			ps.v1_i += 1;
			ps.v2_i += 1;

			if (ps.v1_i >= op.value1.length) {
			    ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i).replace(/</g,"<").replace(">",">") + "</span>";
			    break;
			}
			if (ps.v2_i >= op.value2.length) {
			    ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i).replace(/</g,"<").replace(">",">") + "</span>";
			    break;
			}
		    } else if (ps.v1_eq_max > ps.v2_eq_max) {
			ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i, ps.v1_start - ps.v1_i).replace(/</g,"<").replace(">",">") + "</span>";
			ps.v1_i = ps.v1_start;
		    } else {
			ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i, ps.v2_start - ps.v2_i).replace(/</g,"<").replace(">",">") + "</span>";
			ps.v2_i = ps.v2_start;
		    }
		}
	    }
	    op.value1 = ps.v1_new_value;
	    op.value2 = ps.v2_new_value;
	    return op;
	}
	MyCompare(dom1,dom2)
    },
    /***
     * base64 加密解密
     */
    Base64:{
	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	// public method for encoding
	encode: function(input) {
	    let output = "";
	    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	    let i = 0;
	    input = this._utf8_encode(input);
	    while (i < input.length) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
		    enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
		    enc4 = 64;
		}
		output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
	    }
	    return output;
	},

	// public method for decoding
	decode: function(input) {
	    let output = "";
	    let chr1, chr2, chr3;
	    let enc1, enc2, enc3, enc4;
	    let i = 0;

	    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	    while (i < input.length) {

		enc1 = this._keyStr.indexOf(input.charAt(i++));
		enc2 = this._keyStr.indexOf(input.charAt(i++));
		enc3 = this._keyStr.indexOf(input.charAt(i++));
		enc4 = this._keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 != 64) {
		    output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
		    output = output + String.fromCharCode(chr3);
		}

	    }

	    output = this._utf8_decode(output);

	    return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode: function(string) {
	    string = string.replace(/\r\n/g, "\n");
	    let utftext = "";

	    for (let n = 0; n < string.length; n++) {

		let c = string.charCodeAt(n);

		if (c < 128) {
		    utftext += String.fromCharCode(c);
		} else if ((c > 127) && (c < 2048)) {
		    utftext += String.fromCharCode((c >> 6) | 192);
		    utftext += String.fromCharCode((c & 63) | 128);
		} else {
		    utftext += String.fromCharCode((c >> 12) | 224);
		    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
		    utftext += String.fromCharCode((c & 63) | 128);
		}

	    }

	    return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function(utftext) {
	    let string = "";
	    let i = 0;
	    let [c,c1,c2,c3] = [0,0,0,0];

	    while (i < utftext.length) {
		c = utftext.charCodeAt(i);
		if (c < 128) {
		    string += String.fromCharCode(c);
		    i++;
		} else if ((c > 191) && (c < 224)) {
		    c2 = utftext.charCodeAt(i + 1);
		    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
		    i += 2;
		} else {
		    c2 = utftext.charCodeAt(i + 1);
		    c3 = utftext.charCodeAt(i + 2);
		    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
		    i += 3;
		}
	    }
	    return string;
	},
	/***
	 * 对查询关键字中的特殊字符进行编码
	 * @param key
	 */
	encodeSearchKey:function(key) {
	    const encodeArr = [{
		code: '%',
		encode: '%25'
	    }, {
		code: '?',
		encode: '%3F'
	    }, {
		code: '#',
		encode: '%23'
	    }, {
		code: '&',
		encode: '%26'
	    }, {
		code: '=',
		encode: '%3D'
	    }];
	    return key.replace(/[%?#&=]/g, ($, index, str) => {
		for (const k of encodeArr) {
		    if (k.code === $) {
			return k.encode;
		    }
		}
	    });
	},

	},
	/***
	 * 对查询关键字中的特殊字符进行编码
	 * @param key
	 */
	encodeSearchKey:function(key) {
	    const encodeArr = [{
		code: '%',
		encode: '%25'
	    }, {
		code: '?',
		encode: '%3F'
	    }, {
		code: '#',
		encode: '%23'
	    }, {
		code: '&',
		encode: '%26'
	    }, {
		code: '=',
		encode: '%3D'
	    }];
	    return key.replace(/[%?#&=]/g, ($, index, str) => {
		for (const k of encodeArr) {
		    if (k.code === $) {
			return k.encode;
		    }
		}
	    });
	},
};
