//app.js
// var prom = require("./utils/prom.js");本处理异步加载问题,此版本删除引包
var openId;
var bind_flag = 0;
App({
  onLaunch: function (e) {
    // 获取电话缓存
    var tel_Sync = wx.getStorageSync('telePhonesync');

    // 缓存用户ID
    var mdkey_openId = wx.getStorageSync('mdkey') || "";
    console.log(mdkey_openId);
    if (mdkey_openId.open) {
      openId = mdkey_openId.open;

      setTimeout(function () {
        if (bind_flag != 1) {
          loc_sync();
        };
      }, 1000)
    }

    // 登录拿code调后台请求获取id等秘钥
    wx.login({
      success: res => {
        var _that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        //res -code值
        var code = res.code
        if (res.code) {
          wx.request({
            // url: "https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code",
            // 公司id和秘钥生成openId, sessionKey, unionId
            // url: 'http://192.168.2.31:8080/xcxUser/getOpenId?',//用户登录接口--唐鹏飞      
            // url: 'https://lite.zuogj.com/xcxUser/getOpenId?',
            url: 'http://116.205.13.132:1314/xcxUser/getOpenId?',
            data: { code: code },
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              //请求成功拿到秘钥数据expires_in, openid, session_key, unionid
              var jiso = JSON.parse(res.data.msg);
              // 判断用户是否已注册
              console.log('openId' + jiso.openid);
              openId = jiso.openid;

              // openid异步加载
              // _that.globalData.openId_g = jiso.openid;
              // if (this.emopenidCallback) {
              //   this.emopenidCallback(openId_g)
              // };

              // 
              var md = {
                key: jiso.session_key,
                open: jiso.openid,
                union: jiso.unionid,
              };
              // 缓存隐秘数据
              try {
                wx.setStorageSync('mdkey', md)
              } catch (e) {
                console.log("数据缓存失败")
              };
              if (bind_flag != 1) {
                loc_sync();
              };
            },
            fail: function () {
              console.log(res);
              wx.showModal({
                title: '温馨提示',
                content: "微信权限失败，请稍后重试",
                showCancel: false
              })
            },
          })
        } else {
          console.log('获取用户登录态code失败！' + res.errMsg)
        }
      }
    }),
      // 获取用户微信信息
      wx.getSetting({
        success: res => {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                console.log(res);
                this.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
  },
  globalData: {
    openId_g: "",
    userInfo: "",
    // url_all: "http://59.173.242.138:1314/",
    url_all: "http://116.205.13.132:1314/",        //樊
    // url_all: "https://lite.zuogj.com/",         //正式环境
    // 未替换配置和本页33  156code请求未替换
    // sign_callback: "https://lite.zuogj.com/xcxUser/callBackReg"
    // sign_callback: "http://59.173.242.138:1314/xcxUser/callBackReg",
    sign_callback: "http://116.205.13.132:1314/xcxUser/callBackReg",     //樊

  },
  // 签约返回场景
  onShow(res) {
    console.log("场景" + res.scene);
    if (res.scene === 1038) { // 场景值1038：从被打开的小程序返回
      console.log(res)//返回OBJ-path:bind...;referrerIofo:object appId:"wxbd687630cd02ce1d"
      const { appId, extraData } = res.referrerInfo
      if (appId == 'wxbd687630cd02ce1d') { // appId为wxbd687630cd02ce1d：从签约小程序跳转回来
        console.log("appId为wxbd687630cd02ce1d：从签约小程序跳转回来")
        if (typeof extraData == 'undefined') {
          // TODO
          // 客户端小程序不确定签约结果，需要向商户侧后台请求确定签约结果
          return;
        }
        if (extraData.return_code == 'SUCCESS') {
          wx.switchTab({
            //绑定成功微信方有成功提示页面，直接跳转至二维码
            url: "../hkmovie/hkmovie"
          })
          // TODO
          // 客户端小程序签约成功，需要向商户侧后台请求确认签约结果
          var contract_id = extraData.contract_id;
          console.log(contract_id);//"201801050466718334"样子
          return;
        } else {
          // TODO
          // 签约失败
          return;
        }
      }
    }
  }
});


// 获取app.js页面缓存code数据====判断用户绑定状态直接跳转二维码页面
function loc_sync() {
  // 判断用户绑定
  wx.request({
    // url: 'http://192.168.2.31:8080/xcxUser/isBind?',//用户登录接口--唐鹏飞
    // url: 'http://59.173.242.138:1314/xcxUser/isBind?',
    url: "http://116.205.13.132:1314/xcxUser/isBind?",//樊
    // url: 'https://lite.zuogj.com/xcxUser/isBind?',//线上
    data: { openId: openId },
    method: 'POST',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(openId);
      console.log(res);
      console.log(res.data.statusCode);
      // 根据后台状态码判定是否注册
      if (res.data.statusCode == 100000) {
        bind_flag = 1;
        try {
          wx.setStorageSync('bind_flag', bind_flag)
        } catch (e) {
          console.log("bind_flag缓存失败")
        };
        console.log("该用户已绑定" + bind_flag);
        wx.switchTab({
          url: "../hkmovie/hkmovie"
        })
      } else if (res.data.statusCode == 100002) {
        bind_flag = 0;
        console.log(res.data.msg)
      } else if (res.data.statusCode == 999999) {
        wx.showModal({
          title: '温馨提示',
          content: res.data.msg,
          showCancel: false
        })
      } else if (res.data.statusCode == 100003) {
        console.log(res.data.msg)
      } else if (res.data.statusCode == 100001) {
        wx.showModal({
          title: '温馨提示',
          content: "请求状态失败，请重新进入小程序",
          showCancel: false
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: res.data.msg,
          showCancel: false
        })
      }
    },
    fail: function () {
      console.log("isBind--fail")
    },
  })
}
