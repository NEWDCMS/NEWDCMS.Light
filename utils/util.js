import commonUtils from '../dist/common/js/common-utils';
const gbk = require('./gbk.js');

//格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDateTime = (time) => {
  if (time >= 60 && time <= 3600) {
    time = parseInt(time / 60) + "分" + time % 60 + "秒";
  } else {
    if (time > 3600) {
      time = parseInt(time / 3600) + "小时" + parseInt(((time % 3600) / 60)) + "分" + time % 60 + "秒";
    } else {
      time = time + "秒";
    }
  }
  return time;
}

//格式数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//字符串转16进制Buff
const hexStringToBuff = str => { //str='中国：WXHSH'
  //const buffer = new ArrayBuffer((sumStrLength(str)) * 4)
  const buffer = new ArrayBuffer((sumStrLength(str)) + 1);
  const dataView = new DataView(buffer)
  var data = str.toString();
  var p = 0; //ArrayBuffer 偏移量
  for (var i = 0; i < data.length; i++) {
    if (isCN(data[i])) { //是中文
      //console.log('中午、文')
      //调用GBK 转码
      // //console.log(29,data[i])
      var t = gbk.encode(data[i]);
      for (var j = 0; j < 2; j++) {
        //var code = t[j * 2] + t[j * 2 + 1];
        var code = t[j * 3 + 1] + t[j * 3 + 2];
        var temp = parseInt(code, 16)
        //var temp = strToHexCharCode(code);
        dataView.setUint8(p++, temp)
      }
    } else {
      //console.log('数字')
      var temp = data.charCodeAt(i);
      dataView.setUint8(p++, temp)
    }
  }
  return buffer;
}

// ArrayBuffer转16进度字符串示例
const ab2hex = buffer => {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(',')
}

//转Unicode编码
function toUnicode(s) {
  var str = "";
  for (var i = 0; i < s.length; i++) {
    str += "\\u" + s.charCodeAt(i).toString(16) + "\t";
  }
  return str;
}

function strToHexCharCode(str) {
  if (str === "")
    return "";
  var hexCharCode = [];
  hexCharCode.push("0x");
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16));
  }
  return hexCharCode.join("");
}

//获取字符串长度
function sumStrLength(str) {
  var length = 0;
  var data = str.toString();
  for (var i = 0; i < data.length; i++) {
    if (isCN(data[i])) { //是中文
      length += 2;
    } else {
      length += 1;
    }
  }
  return length;
}

//判断是否中文字符
function isCN(str) {
  let characterA = /^[\u4e00-\u9fa5]+$/
  let characterB = /^[\uFF01]|[\uFF0C-\uFF0E]|[\uFF1A-\uFF1B]|[\uFF1F]|[\uFF08-\uFF09]|[\u3001-\u3002]|[\u3010-\u3011]|[\u201C-\u201D]|[\u2013-\u2014]|[\u2018-\u2019]|[\u2026]|[\u3008-\u300F]|[\u3014-\u3015]+$/
  if (characterA.test(str) || characterB.test(str)) {
    return true;
  } else {
    return false;
  }
}

//汉字转码
function hexStringToArrayBuffer(str) {
  const buffer = new ArrayBuffer((str.length / 2) + 1)
  const dataView = new DataView(buffer)
  for (var i = 0; i < str.length / 2; i++) {
    var temp = parseInt(str[i * 2] + str[i * 2 + 1], 16)
    dataView.setUint8(i, temp)
  }
  dataView.setUint8((str.length / 2), 0x0a)
  return buffer;
}

//返回八位数组
function subString(str) {
  var arr = [];
  if (str.length > 8) { //大于8
    for (var i = 0;
      (i * 8) < str.length; i++) {
      var temp = str.substring(i * 8, 8 * i + 8);
      arr.push(temp)
    }
    return arr;
  } else {
    return str
  }
}

function isChinese(str) {
  return /^[\u4e00-\u9fa5]$/.test(str);
}

function cutString(str, n) {
  var strArr = [];
  ////console.log(str.length);
  ////console.log(this.sumStrLength(str));
  let length = 0;
  var temp = ''
  for (var i = 0; i < str.length; i++) {
    if (isChinese(str[i])) { //是中文
      length += 2;
      temp += str[i]
    } else {
      length += 1;
      temp += str[i]
    }
    if (length >= n) {
      strArr.push(temp);
      temp = ''
      length = 0
    }
  }

  return strArr;
}


function cutString2(str, len) {
  if (!str || !len) {
    return '';
  }
  // 预期计数：中文2字节，英文1字节
  var a = 0;
  // 循环计数
  var i = 0;
  // 临时字串
  var temp = '';
  for (i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      // 按照预期计数增加2
      a += 2;
    } else {
      a++;
    }
    // 如果增加计数后长度大于限定长度，就直接返回临时字符串
    if (a > len) {
      return temp;

    }
    // 将当前内容加到临时字符串
    temp += str.charAt(i);
  }
  // 如果全部是单字节字符，就直接返回源字符串
  return str;
}


//不带有汉字
function hexStringToArrayBufferstr(str) {
  let val = ""
  for (let i = 0; i < str.length; i++) {
    if (val === '') {
      val = str.charCodeAt(i).toString(16)
    } else {
      val += ',' + str.charCodeAt(i).toString(16)
    }
  }
  val += "," + "0x0a";
  //console.log(val)
  // 将16进制转化为ArrayBuffer
  return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  })).buffer
}

//换行符号
function send0X0A() {
  const buffer = new ArrayBuffer(1)
  const dataView = new DataView(buffer)
  dataView.setUint8(0, 0x0a)
  return buffer;
}

function sendDirective(arr) {
  const buffer = new ArrayBuffer(arr.length)
  const dataView = new DataView(buffer)
  for (let i in arr) {
    dataView.setUint8(i, arr[i])
  }
  return buffer;
}

//替换字符串
function replaceStr(str) {
  str = str.toString();
  // //console.log(147, str)
  if (str) {
    let len = getBytesLength(str);
    let minLen = 4;
    if (len < minLen) {
      let nstr = '';
      for (let i = 0; i < minLen - len; i++) {
        nstr = nstr + ' ';
      }
      str = nstr + str;
    } else {
      str = str;
    }
  } else {
    str = ''
  }
  //console.log(163, str);
  return str
}

//打印2列数据
function printTwoData(leftText, rightText) {
  let sb = '';
  let maxLen = 0;
  let leftTextLength = getBytesLength(leftText);
  let rightTextLength = getBytesLength(rightText);
  let spaceLen = maxLen - leftTextLength - rightTextLength;
  sb = sb + leftText;
  for (let i = 0; i < spaceLen; i++) {
    sb = sb + ' ';
  }
  sb = sb + rightText + '\n';
  return sb.toString();
}

//打印3列数据
function printThreeData(leftText, centerText, rightText) {
  let sb = '';
  let maxLen = 0;

  leftText = replaceStr(leftText);
  centerText = replaceStr(centerText);
  rightText = replaceStr(rightText);

  let leftTextLength = getBytesLength(leftText);
  let centerTextLength = getBytesLength(centerText);
  let rightTextLength = getBytesLength(rightText);
  let spaceLeft = maxLen / 2 - leftTextLength - centerTextLength / 2;
  let spaceRight = maxLen / 2 - centerTextLength / 2 - rightTextLength;

  //console.log(168, leftTextLength, centerTextLength, rightTextLength, spaceLeft, spaceRight);
  sb = sb + leftText;
  for (let i = 0; i < spaceLeft; i++) {
    sb = sb + ' ';
  }
  sb = sb + centerText;
  for (let i = 0; i < spaceRight; i++) {
    sb = sb + ' ';
  }
  sb = sb + rightText + '\n';
  //console.log('printThreeData', sb);
  return sb.toString();
}

function getBytesLength(val) {
  var str = new String(val);
  var bytesCount = 0;
  for (var i = 0, n = str.length; i < n; i++) {
    var c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      bytesCount += 1;
    } else {
      bytesCount += 2;
    }
  }
  return bytesCount;
}
//============================

//判断是否为空
const isEmpty = (v) => {
  if (v == null || v == undefined || v == {}) {
    return true;
  }
  switch (typeof v) {
    case 'undefined':
      return true;
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
      break;
    case 'boolean':
      if (!v) return true;
      break;
    case 'number':
      if (0 === v || isNaN(v)) return true;
      break;
    case 'object':
      if (null === v || v.length === 0) return true;
      for (var i in v) {
        return false;
      }
      return true;
  }
  return false;
}

const calcDateDistanceString = (datetime1, datetime2) => {
  let date3 = new Date(datetime2).getTime() - new Date(datetime1).getTime(); //时间差的毫秒数      
  //计算出相差天数
  let days = Math.floor(date3 / (24 * 3600 * 1000))

  //计算出小时数
  let leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数
  let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000)
  //return `${days}天${hours}小时${minutes}分${seconds}秒`
  return `${days}天${hours}小时${minutes}分`
}

const isNullOrEmpty = (str) => {
  if (str.toString().replace(/(^s*)|(s*$)/g, "").length == 0) {
    return true
  } else {
    return false
  }
}

//判断对象是否为空
const isNull = (str) => {
  if (Object.prototype.toString.call(str) === '[object Undefined]') { //空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else {
    return true
  }
}

/** 
 * 获取时间
 * 20160106173721310
 */
const getJSCurrTime = () => {
  let d, s = "";
  d = new Date();
  s += d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let hour = d.getHours();
  let minu = d.getMinutes();
  let sec = d.getSeconds();
  s += month < 10 ? "0" + month : month;
  s += day < 10 ? "0" + day : day;
  s += hour < 10 ? "0" + hour : hour;
  s += minu < 10 ? "0" + minu : minu;
  s += sec < 10 ? "0" + sec : sec;
  s += d.getMilliseconds();
  return s;
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

//验证手机号码
const checkMobile = (mobile) => {
  if (!(/^1\d{10}$/.test(mobile))) {
    return false;
  }
  return true;
}
//生成随机n位数字
const mathRand = (n) => {
  let num = "";
  for (let i = 0; i < n; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

// 判断字符串是不是以某个字符串结尾
const endWith = (str, target) => {
  let reg = new RegExp('^.*' + target + '$');
  return reg.test(str)
}

//判断字符串是不是以某个字符串开头
const startWith = (str, target) => {
  let reg = new RegExp("^" + target);
  return reg.test(str);
}
//时间格式化
const moment = (fmt, nt = null) => {
  let date;
  if (nt) {
    date = new Date(nt);
  } else {
    date = new Date();
  }

  const o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds() // 毫秒
  };

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//获取时间
const getTime = (nowYear, nowMonth, format = null) => {
  nowMonth = Number(nowMonth) - 1;
  let monthStartDate = new Date(nowYear, nowMonth, 1);
  //本月的结束时间
  let monthEndDate = new Date(nowYear, nowMonth + 1, 0);
  let timeStar = Date.parse(String(monthStartDate)); //s
  let timeEnd = Date.parse(String(monthEndDate)); //s
  //console.log()
  if (format) {
    return {
      timeStar: moment(format, timeStar),
      timeEnd: moment(format, timeEnd)
    }
  } else {
    return {
      timeStar,
      timeEnd
    }
  }
}
const genUUID = (len = 35, radix = 10) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    let r;
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return `p${uuid.join('')}`;
}
//从数组中移除指定对象
const arrRemoveObj = (arr, obj) => {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i] === obj) {
      if (i === 0) {
        arr.shift();
        return arr;
      } else if (i === len - 1) {
        arr.pop();
        return arr;
      } else {
        arr.splice(i, 1);
        return arr;
      }
    }
  }
}

//获取本地时间
const now = (add) => {
  var dd = new Date();
  dd.setDate(dd.getDate() + add);
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期 
  var d = dd.getDate();
  return y + "-" + m + "-" + d;
}

//获取本地时间
const time = () => {
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  //获取当前时间
  var n = timestamp * 1000;
  var date = new Date(n);
  //年
  var Y = date.getFullYear();
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  //分
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  //秒
  var s = date.getSeconds();
  //2021-11-30 00:00:00
  return (Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s)
}

const getNumHash = (showNumber) => {
  let num_hash = [];
  let index = 0;
  while (showNumber / 10 != 0) {
    num_hash[index] = (showNumber % 10);
    showNumber = Math.floor(showNumber /= 10)
    index++;
  }
  num_hash[index] = showNumber;

  return {
    realCount: index + 1,
    hash: num_hash
  };
}


// 第一个参数是要求和的数组对象，后面是要求和的字段（不定项）
const sum = (arr, ...param) => {
  var temp = {};
  arr.forEach(function (item, index) {
    for (var k in item) {
      if (param.indexOf(k) >= 0) {
        if ((typeof item[k]) == 'string') {
          item[k] = item[k] * 1
        }
        if (temp[k]) {
          temp[k] += (item[k]);
        } else {
          temp[k] = (item[k]);
        }
      }
    }
  });
  return temp;
};

const getGUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const isTimeTemp = (data) => {
  var reg = /^\d+(\.\d+)?$/;
  return reg.test(data);
}

//获取指定时间戳的日期格式
const getDate = (str) => {
  if (isTimeTemp(str)) {
    str = parseInt(str);
  }
  var dd = new Date(str);
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;
  var d = dd.getDate();
  return y + "-" + (m < 10 ? '0' + m : '' + m) + "-" + (d < 10 ? '0' + d : '' + d);
}



const isObjEmpty = (obj) => {
  try {
    if (obj == null || obj == undefined) {
      return true;
    }
    //判断数字是否是NaN
    if (typeof obj === "number") {
      if (isNaN(obj)) {
        return true;
      } else {
        return false;
      }
    }
    //判断参数是否是布尔、函数、日期、正则，是则返回false
    if (typeof obj === "boolean" || typeof obj === "function" || obj instanceof Date || obj instanceof RegExp) {
      return false;
    }
    //判断参数是否是字符串，去空，如果长度为0则返回true
    if (typeof obj === "string") {
      if (obj.trim().length == 0) {
        return true;
      } else {
        return false;
      }
    }

    if (typeof obj === 'object') {
      //判断参数是否是数组，数组为空则返回true
      if (obj instanceof Array) {
        if (obj.length == 0) {
          return true;
        } else {
          return false;
        }
      }

      //判断参数是否是对象，判断是否是空对象，是则返回true
      if (obj instanceof Object) {
        //判断对象属性个数
        if (Object.getOwnPropertyNames(obj).length == 0) {
          return true;
        } else {
          return false;
        }
      }
    }
  } catch (e) {
    //console.log(e);
    return false;
  }
}

const isNotEmpty = (obj) => {
  try {
    if (obj == null || obj == undefined) {
      return false;
    }
    //判断数字是否是NaN
    if (typeof obj === "number") {
      if (isNaN(obj)) {
        return false;
      } else {
        return true;
      }
    }
    //判断参数是否是布尔、函数、日期、正则，是则返回true
    if (typeof obj === "boolean" || typeof obj === "function" || obj instanceof Date || obj instanceof RegExp) {
      return true;
    }
    //判断参数是否是字符串，去空，如果长度为0则返回false
    if (typeof obj === "string") {
      if (obj.trim().length == 0) {
        return false;
      } else {
        return true;
      }
    }

    if (typeof obj === 'object') {
      //判断参数是否是数组，数组为空则返回false
      if (obj instanceof Array) {
        if (obj.length == 0) {
          return false;
        } else {
          return true;
        }
      }

      //判断参数是否是对象，判断是否是空对象，是则返回false
      if (obj instanceof Object) {
        //判断对象属性个数
        if (Object.getOwnPropertyNames(obj).length == 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  } catch (e) {
    //console.log(e);
    return false;
  }
}

/* 生成单据号 */
const getBillNumber = (billType, storeId) => {
  let stamp = new Date().getTime();
  let str = storeId;
  //console.log('storeId', storeId)
  //7位经销商编号，支持百万家
  if (str.length > 7) {
    var start = parseInt(str.subString(0, 7));
    var end = parseInt(str.subString(7, str.length - 7));
    storeId = parseInt(start + end);
  }
  let nh = getNumHash(storeId);
  let realCount = nh.realCount;
  let numArry = nh.hash;
  let arry = [7];
  for (var i = 0; i < 7; i++) {
    if (realCount > i) {
      arry[i] = numArry[i];
    } else {
      arry[i] = 0;
    }
  }
  return billType + "" + arry.join('') + "" + stamp;
}

const showActionSheet = ({
  itemList,
  showCancel = false,
  title = '',
  locked = false
}, callback, cancel) => {
  wx.lin.showActionSheet({
    itemList: itemList,
    showCancel: showCancel,
    title: title,
    locked,
    success: (res) => {
      callback(res.item)
    },
    fail: (res) => {
      //console.error(res);
      if (cancel)
        cancel();
    }
  });
}

const checkMoney = (money) => {
  let exp = /^([0-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
  if (exp.test(money)) {
    return true;
  } else {
    return false;
  }
}

//数字金额大写转化
const digitUppercase = (n) => {
  var fraction = ['角', '分'];
  var digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ];
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  var head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  var s = '';
  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}
/**
 * JS 计算两个时间间隔多久（时分秒）
 * @param startTime "2019-10-23 15:27:23"
 * @param endTime "2019-10-23 15:27:55"
 * @return 1天2时3分5秒
 */
const twoTimeInterval = (startTime, endTime) => {

  // 开始时间
  let d1 = startTime.replace(/\-/g, "/");
  let date1 = new Date(d1);

  // 结束时间
  let d2 = endTime.replace(/\-/g, "/");
  let date2 = new Date(d2);

  // 时间相差秒数
  let dateDiff = date2.getTime() - date1.getTime();

  // 计算出相差天数
  let days = Math.floor(dateDiff / (24 * 3600 * 1000));

  // 计算出小时数
  let residue1 = dateDiff % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
  let hours = Math.floor(residue1 / (3600 * 1000));

  // 计算相差分钟数
  let residue2 = residue1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  let minutes = Math.floor(residue2 / (60 * 1000));

  // 计算相差秒数
  let residue3 = residue2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
  let seconds = Math.round(residue3 / 1000);

  let returnVal =
    ((days == 0) ? "" : days + "天") +
    ((hours == 0) ? "" : days + "时") +
    ((minutes == 0) ? "" : minutes + "分") +
    ((seconds == 0) ? "" : seconds + "秒");

  return returnVal;

}

/* scanCode */
const scanCode = (type, callback, failback) => {
  wx.scanCode({
    success: (res) => {
      ////console.log("扫码结果");
      ////console.log(res);
      var Url = 'https://api.jsdcms.com/';
      wx.request({
        url: Url + "test/scancode?code=" + res,
        success: function (res) {
          wx.showModal({
            title: '提示',
            content: '验证结果:' + res.data.Data,
            success: function (res) {
              if (res.confirm) {
                callback(res.data.Data)
              }
            }
          })
        }
      })
    },
    fail: (res) => {
      failback(res)
    }
  })
}

/* 格式化XX大XX中XX小 */
const quantityFormat = (totalQuantity, mCQuantity, bCQuantity) => {
  {
    try {

      //console.log('totalQuantity', totalQuantity) //1
      //console.log('mCQuantity', mCQuantity) //6
      //console.log('bCQuantity', bCQuantity) //12

      var thisQuantity = totalQuantity;
      var result = '';

      var bigQuantity = bCQuantity;
      var strokeQuantity = mCQuantity;

      var big = 0;
      var stroke = 0;
      var small = 0;

      //大
      if (bigQuantity > 0) {
        big = parseInt(thisQuantity / bigQuantity);
        //console.log('big', big)
        if (big > 0)
          thisQuantity = thisQuantity - big * bigQuantity;
      }
      //中
      if (strokeQuantity > 0) {
        stroke = parseInt(thisQuantity / bigQuantity);
        if (stroke > 0)
          thisQuantity = thisQuantity - stroke * strokeQuantity;
      }

      //小
      small = thisQuantity;

      if (big > 0)
        result = big + '大'

      if (stroke > 0)
        result = stroke + '中'

      if (small > 0)
        result += small + '小'

      //console.log('result', result)

      return result
    } catch (ex) {
      //console.log(ex)
      return ''
    }
  }
}
const quantityFormatUnitName = (totalQuantity, mCQuantity, bCQuantity, smallQuantityName = '小', strokeQuantityName = '中', bigQuantityName = '大') => {
  {
    try {

      var thisQuantity = totalQuantity;
      var result = '';

      var bigQuantity = bCQuantity;
      var strokeQuantity = mCQuantity;

      var big = 0;
      var stroke = 0;
      var small = 0;

      //大
      if (bigQuantity > 0) {
        big = parseInt(thisQuantity / bigQuantity);
        //console.log('big', big)
        if (big > 0)
          thisQuantity = thisQuantity - big * bigQuantity;
      }
      //中
      if (strokeQuantity > 0) {
        stroke = parseInt(thisQuantity / bigQuantity);
        if (stroke > 0)
          thisQuantity = thisQuantity - stroke * strokeQuantity;
      }

      //小
      small = thisQuantity;

      if (big > 0)
        result = big + bigQuantityName

      if (stroke > 0)
        result = stroke + strokeQuantityName

      if (small > 0)
        result += small + smallQuantityName

      //console.log('result', result)

      return result
    } catch (ex) {
      //console.log(ex)
      return ''
    }
  }
}
const dateFormatYYYYMMDD = (date) => {

  switch (typeof date) {
    case 'undefined':
    case 'boolean':
    case 'number':
      return '';
    case 'string':
      date = new Date(date + "Z"); //转换成Data();
      break;
  }
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
}

module.exports = {
  arrRemoveObj: arrRemoveObj,
  showLoading: commonUtils.showCustomLoading,
  hideLoading: commonUtils.hideCustomLoading,
  throttle: commonUtils.throttle,
  debounce: commonUtils.debounce,
  sleep,
  time,
  now,
  getJSCurrTime,
  checkMobile,
  endWith,
  startWith,
  moment,
  getTime,
  genUUID,
  mathRand,
  isEmpty,
  isObjEmpty,
  isNotEmpty,
  isNull,
  isNullOrEmpty,
  cutString: cutString,
  calcDateDistanceString,
  compareVersion: commonUtils.compareVersion,
  accAdd: commonUtils.accAdd,
  accSub: commonUtils.accSub,
  accDiv: commonUtils.accDiv,
  accMul: commonUtils.accMul,
  formatNumDecimals: commonUtils.formatNumDecimals,
  isObj: commonUtils.isObj,
  nextTick: commonUtils.nextTick,
  isDef: commonUtils.isDef,
  //2021-10-20 新增补函数
  ab2hex: ab2hex,
  hexStringToArrayBuffer,
  hexStringToBuff,
  sumStrLength,
  sendDirective,
  printTwoData,
  printThreeData,
  sum: sum,
  isTimeTemp,
  getDate,
  getGUID,
  getNumHash,
  getBillNumber,
  showActionSheet,
  checkMoney,
  digitUppercase,
  twoTimeInterval,
  scanCode,
  quantityFormat,
  quantityFormatUnitName,
  dateFormatYYYYMMDD,
  formatDateTime
}