const app = getApp();
// md5加密雁验证码
var md55 = require("../../utils/md5.js");
var mdkey;
var telePhone;
var openId;
// 在微信方信息
var userInfo;
// var nickName;
var avatarUrl;
var sex;//性别 0：未知、1：男、2：女 
var province;
var city;
var country;
// 定位信息
var city_now;
var citycode;
var is_flsgHk;
Page({
  data: {
    click_onload: false,
    disabled: false,
    tele: "",
    verifyCore: "",
    userCode: "",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    msg: '获取验证码',
    currentCity: '',
  },
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    // 检测授权状态追加
    this.checkSettingStatu();

    // hkmovie跳转校验
    is_flsgHk = wx.getStorageSync('bind_flag');

    mdkey = wx.getStorageSync('mdkey');
    console.log("xxxxxx" + mdkey);
    openId = mdkey.open;
    console.log("xxxxxx" + openId);
    if (!openId) {
      // 登录拿code调后台请求获取id等秘钥
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res);
          //res -code值
          var code = res.code
          if (res.code) {
            wx.request({
              url: app.globalData.url_all + 'xcxUser/getOpenId?',
              data: { code: code },
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
                //请求成功拿到秘钥数据expires_in, openid, session_key, unionid
                var jiso = JSON.parse(res.data.msg);
                console.log('openId' + jiso.openid);
                openId = jiso.openid;
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
      })
    };

    // openid异步
    // if (app.globalData.openId_g && app.globalData.openId_g != "") {
    //   openId = app.globalData.openId_g;
    //   console.log("emopenidCallback1" + app.globalData.openId_g)
    // }
    // else {
    //   app.emopenidCallback = openId_g => {
    //     if (openId_g != "") {
    //       openId = app.globalData.openId_g;
    //       console.log("emopenidCallback2" + app.globalData.openId_g)
    //     }
    //   }
    // };

    // 定位当前手机定位经纬度
    this.getLocation();
  },

  // 
  onShow: function (options) {
    console.log("index跳转");
    if (openId) {
      wx.request({
        url: app.globalData.url_all + 'xcxUser/isBind?',//用户登录接口--唐鹏飞 线上
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
            console.log("该用户已绑定");

            // hkmovie挑战校验
            // if (is_flsgHk == 0) {
            wx.switchTab({
              url: "../hkmovie/hkmovie",
            })
            // }

          } else if (res.data.statusCode == 100002) {
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
  },
  // 检测授权状态追加
  // onShow: function () {
  //   this.checkSettingStatu();
  // },
  // 检测授权状态追加
  checkSettingStatu: function (cb) {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (isEmptyObject(authSetting)) {
          console.log('首次授权');
        } else {
          console.log('不是第一次授权', authSetting);
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用二维码乘车，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(res) {
                      console.log('openSetting success', res.authSetting);
                    }
                  });
                }
              }
            })
          }
        }
      }
    });
  },

  // 
  // 页面渲染完成自动请求信息
  onReady: function () {
    wx.getUserInfo({
      success: function (res) {
        // 获取用户在微信的信息
        console.log(res)
        userInfo = res.userInfo
        // nickName = userInfo.nickName
        avatarUrl = userInfo.avatarUrl
        sex = userInfo.gender //性别 0：未知、1：男、2：女
        province = userInfo.province
        city = userInfo.city
        country = userInfo.country
      },
      // 与上面checkSettingStatu校验冲突
      // fail: function () {
      //   wx.showModal({
      //     title: "温馨提示",
      //     content: "微信获取权限失败，请授权",
      //     showCancel: true
      //   });
      // }
    })
  },
  // 经纬度转城市
  getLocation: function () {
    var page = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        console.log(longitude)
        console.log(latitude)
        page.loadCity(longitude, latitude)
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var page = this;
    wx.request({
      // 高德逆编码
      url: "https://restapi.amap.com/v3/geocode/regeo?key=0cc6e8843aa3ee5ed36fafda6e585f08&location=" + longitude + "," + latitude + "",
      data: {},
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        // 定位城市
        if (typeof (res.data.regeocode.addressComponent.city) == "string") {
          city_now = res.data.regeocode.addressComponent.city
        } else {
          city_now = "";
          wx.showModal({
            title: "温馨提示",
            content: "定位失败，请重新进入获取",
            showCancel: false
          });
        }
        // 定位城市ID并缓存
        citycode = (res.data.regeocode.addressComponent.adcode).slice(0, 4) + '00';
        console.log(citycode);
        try {
          wx.setStorageSync('city_now', city_now)
        } catch (e) {
          console.log("城市定位缓存失败")
        };
        try {
          wx.setStorageSync('city_code', citycode)
        } catch (e) {
          console.log("城市CODE缓存失败")
        }
        // 设置城市
        page.setData({
          currentCity: city_now
        });
        // 传citycode与后台校验4.3-------3.4Bate
        wx.request({
          url: app.globalData.url_all + 'xcxUser/citys',
          data: {},
          method: 'POST',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            var xcxUser_citycode = res.data.obj;

            isInArray(xcxUser_citycode, citycode);
            // Array.from(xcxUser_citycode).forEach(index => {
            //   if (citycode !== index) {
            //     console.log(index);
            //     wx.showModal({
            //       title: '温馨提示',
            //       content: "此城市未开通此服务，敬请期待",
            //       showCancel: false
            //     })
            //   }
            // });

          },
          fail: function () {
            console.log("xcxUser/citys--isfail");
          },
        })

        // 
        // 城市判断       黄山                  邯郸
        // if (citycode != 341000 || citycode != 130400) {
        //   wx.showModal({
        //     title: '温馨提示',
        //     content: "当前城市正在快马加鞭开通此功能",
        //     showCancel: false
        //   });
        //   return false;
        // };
      },
      fail: function () {
        page.setData({ currentCity: "获取定位失败" });
        wx.showModal({
          title: "温馨提示",
          content: "定位失败，请重新获取",
          showCancel: false
        });
      },

    })
  },
  //右上角事件分享公众号页面
  onShareAppMessage: function () {
    return {
      title: '蓝泰源坐公交',
      desc: "坐公交",
      imageUrl: "",
      path: 'pages/index/index?',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //发送短信--验证码
  reSendPhoneNum: function (e) {
    telePhone = this.data.tele;
    if (telePhone !== "") {
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (reg.test(telePhone)) {
        console.log("reg" + telePhone)
        // 倒计时--page外函数应用,当手机正确触发倒计时事件
        // var time = this.data.time;
        // count_down(this, time);
        this.setData({
          msg: 60
        })
        let time = setInterval(() => {
          let msg = this.data.msg
          msg -= 1
          this.setData({
            msg: msg,
            disabled: true,
          })
          if (msg == 0) {
            clearInterval(time)
            this.setData({
              msg: "获取验证码",
              disabled: false,
            })
          }
        }, 1000)
        // 
        var that = this;
        // 获取验证码接口请求
        wx.request({
          url: app.globalData.url_all + 'xcxUser/code?' + makeid_num() + '', //获取验证码接口--tpf线上
          data: { phoneNo: telePhone },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            // 短信验证码
            console.log(res.data.msg);
            that.setData({
              verifyCore: res.data.msg
            })
          },
          fail: function (res) {
            console.log(res);
            wx.showModal({
              title: "温馨提示",
              content: "发送短信失败",
              showCancel: false
            });
            // 短信发送失败清除定时倒计时---复原
            clearInterval(time);
            that.setData({
              msg: "获取验证码",
              disabled: false,
            })
          }
        })
      } else {//如果手机号不正确
        wx.showModal({
          title: "温馨提示",
          content: "请输入正确的手机号码",
          showCancel: false
        })
      }
    }// if (telePhone!=="")
  },
  //获得用户输入手机号
  input_phoneNum: function (e) {
    this.setData({
      tele: e.detail.value
    })
  },
  // x清除
  close: function (e) {
    this.setData({
      tele: ""
    })
  },
  //获得用户输入验证码--监听
  input_identifyCode: function (e) {
    this.setData({
      userCode: (md55.MD5(e.detail.value).toLowerCase())
      // userCode: (md55.MD5("5648").toLowerCase())
    })
  },
  //登陆
  landing: function (e) {
    // var userCode = this.data.userCode;
    // var tele = this.data.tele;
    var that = this;
    // 点击登录--重复点击
    that.setData({
      click_onload: true,
    });
    setTimeout(function () {
      that.setData({
        click_onload: false,
      });
    }, 10000);
    // telePhone为短信接收手机号 verifyCore为后台返回验证码
    if (that.data.userCode == that.data.verifyCore && that.data.tele == telePhone) {
      wx.request({
        url: app.globalData.url_all + 'xcxUser/reg?',  //用户注册接口--tpf线上
        data: { phoneNo: telePhone, openId: openId, nickName: telePhone, sex: sex, cityName: city_now, cityCode: citycode },
        // data: { phoneNo: telePhone, openId: openId, nickName: telePhone, sex: sex, cityName: city_now, cityCode: 341000 },
        // data: { phoneNo: telePhone, openId: openId, nickName: telePhone, sex: sex, cityName: city_now, cityCode: 130400 },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          // 缓存
          try {
            wx.setStorageSync('telePhonesync', telePhone)
          } catch (e) {
            console.log("手机号缓存失败")
          }
          console.log(res);
          // 此为登陆后台状态码提示----100000数据一切正常进入绑定
          if (res.data.statusCode == 100000) {
            wx.navigateTo({
              url: "../bind/bind",
            })
          } else if (res.data.statusCode == 100001) {
            wx.showModal({
              title: '温馨提示',
              content: "注册失败，请重新进入小程序",
              showCancel: false
            })
          } else if (res.data.statusCode == 100009) {
            wx.showModal({
              title: '温馨提示',
              content: "此城市暂未开通此服务，敬请期待",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else {
            console.log(res.data.msg)
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg + "，请重新进入小程序",
              showCancel: false
            })
          }
        },//success
        fail: function () {
          wx.showModal({
            title: '温馨提示',
            content: '登陆失败，请重新进入小程序',
            showCancel: false
          })
        }
      });
      // 登录flag
      // that.setData({
      //   click_onload: false,
      // })
    } else {
      console.log(that.data.userCode)
      console.log(that.data.verifyCore)
      console.log(that.data.tele)
      console.log(telePhone)

      wx.showModal({
        title: '温馨提示',
        content: '请输入正确手机号或验证码',
        showCancel: false
      })
    }
  }
})//page
//page 外 倒计时事件
// function count_down(that, time) {
//   if (that.data.time <= 0) {
//     that.setData({
//       time: 60,
//       disabled: false
//     })
//     return;
//   } else {
//     that.setData({
//       time: time,
//       disabled: true

//     });
//   }
//   console.log(time)
//   setTimeout(function () {
//     // 放在最后--
//     time -= 1;
//     count_down(that, time);
//   }, 1000)
// }
// 随机字符串
function makeid_num() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// 用户授权追加
function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}



// citycode匹配
function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    } else {
      wx.showModal({
        title: '温馨提示',
        content: "此城市暂未开通此服务，敬请期待",
        showCancel: false
      });
      break;
    }
  }
  return false;
}