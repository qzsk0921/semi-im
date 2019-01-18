

// 微信授权
exports.chekLogin =  function () {

    // let isLogin = sessionStorage.getItem('isLogin');
    // let token = sessionStorage.getItem('token');
    // if (isLogin && token) {
    //     return true;
    // } else {
    //     return false;
    // }

    let isLogin = localStorage.getItem('isLogin');
    let token = localStorage.getItem('token');
    if (isLogin && token) {
        return true;
    } else {
        return false;
    }
}

/*
* set localStorage
* @params key string
* @params val
*/
exports.setLocalStorage = function (key, val) {
    localStorage.setItem(key, val);
    // if (key && val) {
    //     localStorage.setItem(key, val);
    // } else {
    //     // console.error('key or val is undefined.');
    //     return false;
    // }
}

/*
*  get localStorage
* @params key string
*
*/
exports.getLocalStorage = function (key) {
    if (key) {
        return localStorage.getItem(key);
    } else {
        console.error('key is undefined.');
        return false;
    }
}


/*
* set sessionStorage
* @params key string
* @params val
*/
exports.setSessionStorage = function (key, val) {
    // if (key && val) {
        sessionStorage.setItem(key, val);
    // } else {
    //     console.error('key or val is undefined.');
    //     return false;
    // }
}

/*
*  get sessionStorage
* @params key string
*
*/
exports.getSessionStorage = function (key) {
    if (key) {
        return sessionStorage.getItem(key);
    } else {
        console.error('key is undefined.');
        return false;
    }
}

/*
*  JSON parse
*  @params jsonString string
*
*/
exports.jsonParse = function (jsonString) {
    if (jsonString) {
        return JSON.parse(jsonString);
    } else {
        console.error('jsonString is undefined')
    }
}


/*
*  JSON parse
*  @params jsonString string
*
*/
exports.getUserInfo = function (key) {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    return userInfo[key];
}

/*
*  验证手机号
*  @params phoneNum string  手机号码
*
*/
exports.checkPhone = function (phoneNum){
    if(!(/^1[34578]\d{9}$/.test(phoneNum))){
        return false;
    }
    return true;
}


/*
*  判断终端
*
*
*/
exports.clientType  = function () {
    let type = '';
    let ua = navigator.userAgent;
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
        type = 'ios';
    } else if (/(Android)/i.test(ua)) {
        type = 'android';
    } else {
        type = 'pc';;
    };
    return type;
}


/*
*  判断微信浏览器
*
*
*/
exports.isWeiXin =  function () {
    var ua = window.navigator.userAgent.toLowerCase();
        //console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/*
*  判断浏览器
*
*
*/
exports.browserType = function () {
    let ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return 'weixin';
    }
    if (ua.match(/WeiBo/i) == 'weibo') {
        return 'weibo'
    }
    if (ua.match(/QQ/i) == 'qq') {
        return 'qq'
    }
    if (ua.match(/LEWAN_HEPAI/i) == 'lewan_hepai') {
        return 'lewan';
    }

}






/*
*  微信分享接口
*  分享到朋友圈
*
*/
exports.shareTimeline = function (title, link, imgUrl, successCallBack, cancelCallBack) {
    wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: successCallBack,   // 用户确认分享后执行的回调函数
        cancel: cancelCallBack   // 用户取消分享后执行的回调函数
    })
}


/*
*  微信分享接口
*  分享给朋友
*
*/
exports.shareAppMessage = function (title, desc, link, imgUrl, type, dataUrl, successCallBack, cancelCallBack) {
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        type: type, // 分享类型,music、video或link，不填默认为link
        dataUrl: dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
        success: successCallBack,   // 用户确认分享后执行的回调函数
        cancel: cancelCallBack  // 用户取消分享后执行的回调函数
    });
}



/*
*  微信分享接口
*  分享到QQ
*
*/
exports.shareQQ = function (title, desc, link, imgUrl, successCallBack, cancelCallBack) {
    wx.onMenuShareQQ({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: successCallBack,
        cancel: cancelCallBack
    });
}

/*
*  微信分享接口
*  分享到腾讯微博
*
*/
exports.shareWeibo = function (title, desc, link, imgUrl, successCallBack, cancelCallBack) {
    wx.onMenuShareWeibo({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: successCallBack,
        cancel: cancelCallBack
    });
}


/*
*  微信分享接口
*  分享到QQ空间
*
*/
exports.shareQZone = function (title, desc, link, imgUrl, successCallBack, cancelCallBack) {
    wx.onMenuShareQZone({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: successCallBack,
        cancel: cancelCallBack
    });
}


/*
*
*  是否为游客模式
*
*/
exports.isGuestLogin = function () {
    if (localStorage.getItem('guestLogin')) {
        return true;
    } else {
        return false
    }
 }



 /*
*
*  获取ch
*
*/
exports.getCh = function () {
    let ch = localStorage.getItem('ch');
    if ( ch == 'undefined' || ch == undefined || ch == '' || ch == null || ch == 'null') {
        ch =  'H5_s_000';
    }
    return ch;
}





