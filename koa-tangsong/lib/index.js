import fs from 'fs';
import path from 'path';

module.exports = {
    /**
     * 递归创建多级目录
     * */ 
    mkdirsSync(dirname) {
        if (fs.existsSync(dirname)){
            return true;
        } else {
            if (this.mkdirsSync(path.dirname(dirname))){
                fs.mkdirSync(dirname);
                return true
            }
        }
    },
    
    uuid() {
        let s = [];
        let hexDigits = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        };
        s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-';
        let uuid = s.join('');
        return uuid;
    },
    /**
     * 将日期格式化为特定格式的字符串
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * DateFormat(Date, 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
     * DateFormat(Date, 'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
     * @param {Date} date 日期
     * @param {String} fmt 字符串格式
     */
    dateFormat(date, fmt) {
        var o = {
        'M+': date.getMonth() + 1, //月份 
        'd+': date.getDate(), //日 
        'h+': date.getHours(), //小时 
        'm+': date.getMinutes(), //分 
        's+': date.getSeconds(), //秒 
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度 
        'S': date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        return fmt;
    },
    /**
     * 解密
     * @param {String} data 数据
     * @param {String} alg 加密算法,支持aes,默认aes
     */
    decrypt(data, alg = 'aes') {
        if (data) {
        return CryptoJS[alg.toUpperCase()].decrypt(data)
        }
        return ''
    },
    /**
     * 加密
     * @param {String} data 数据
     * @param {String} alg 加密算法,支持md5，aes
     */
    encrypt(data, alg = 'md5') {
        if (data) {
        if (alg === 'md5') {
            return CryptoJS.MD5(data).toString()
        } else {
            return CryptoJS[alg.toUpperCase()].encrypt(data, 'encrypt').ciphertext.toString()
        }
        }
        return ''
    }

}