// 第二步登录成功 扫码
var QR = require("../../utils/qrcode.js");
const app = getApp();
var timer;
var open;
var telePhonesync;
var value_city_code;
var mdkey;
// 计时器判断条件
var flag = true;
Page({
  data: {
    // filePath: "",//二维码占位符
    userInfo: {},
    time: 60,
    maskHidden: true,
    call: "",
    // canvasHidden: "",
    // five_surpass: true  //消费超过5次
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取注册手机号缓存
    try {
      telePhonesync = wx.getStorageSync('telePhonesync')
      if (telePhonesync) {
        console.log(telePhonesync)
      }
    } catch (e) {
      console.log("未读取到手机")
    };
    // 获取城市ID缓存
    try {
      value_city_code = wx.getStorageSync('city_code')
      console.log(value_city_code)
    } catch (e) {
      wx.showModal({
        title: '温馨提示',
        content: "未读取到当前城市",
        showCancel: false
      })
    };
    // 数据md获取
    try {
      mdkey = wx.getStorageSync('mdkey')
      if (mdkey) {
        console.log("getStorageSync" + mdkey);
        if (mdkey.open) {//校验openid 处理undefind null
          open = mdkey.open
        } else {
          open = 0
        }
      }
    } catch (e) {
      console.log("未读取到getStorageSync")
    };
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    // 第一次进来T请求一次，然后F
    if (flag) {
      // 页面加载刷新请求二维码
      // move_d();
      this.extent();
      var time = this.data.time;
      var that = this;
      count_down(that, time);
    }
    flag = false;
    // var size = this.setCanvasSize();//动态设置画布大小
    // this.createQrCode("12355", "mycanvas", size.w, size.h);

    // wx.request({
    //   url: "",
    //   //请求报文体
    //   data: [{
    //     // id: "agentCode"
    //   }],
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     wx.hideToast()
    //     var size = that.setCanvasSize();
    //     //绘制二维码
    //     that.createQrCode(that.data.call, "mycanvas", size.w, size.h);
    //     that.setData({
    //       maskHidden: true
    //     });
    //   },
    //   fail: function (res) {
    //     wx.showModal({
    //       title: "温馨提示",
    //       content: "二维码失败",
    //       showCancel: false
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 当为F时请求二维码，主要处理主页面跳转定时器
    if (!flag) {
      // 页面加载刷新请求二维码
      // move_d();
      this.extent();
      var time = this.data.time;
      var that = this;
      count_down(that, time);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面调走清除定时器
    clearInterval(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
  /**
   * 主动点击刷新重新获取二维码
   */
  move: function (e) {
    // move_d(e)
    this.extent();
    console.log(this)
  },
  /**
   * 应要求--点击二维码刷新
   */
  previewImg: function (e) {
    this.extent();
    console.log(this)
  },

  //适配canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync(res);
      console.log(res)
      // var scale = res.windowHeight/(476*2);
      var width = res.windowWidth * 0.88;
      console.log(width)
      var height = width;
      console.log(width)
      size.w = width;
      size.h = height;
    } catch (e) {
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  //调用插件中的draw方法，绘制二维码图片
  createQrCode: function (url, canvasId, cavW, cavH) {
    QR.qrApi.draw(url, canvasId, cavW, cavH);
  },
  // 整理-----二维码处理------
  extent: function () {
    var that = this
    wx.request({
      url: app.globalData.url_all + 'xcxCode/generateCode?', //线上
      // data: { openId: open, cityCode: 130400 },//邯郸
      // data: { openId: open, cityCode: 341000 },//黄山
      data: { openId: open, cityCode: value_city_code },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res.data.statusCode)//10000
        if (res.data.statusCode == 100000) {

          var qcode = res.data.msg
          wx.hideToast()
          var size = that.setCanvasSize();
          that.setData({
            call: qcode
          });
          //绘制二维码
          that.createQrCode(that.data.call, "mycanvas", size.w, size.h);
        } else if (res.data.statusCode == 100012) {//二维码超过5次消费
          wx.showModal({
            title: "温馨提示",
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../logs/logs',
                })
              }
            }
          })
          // that.setData({
          //   canvasHidden: true,
          //   five_surpass: false
          // });

          // clearInterval(timer);
        } else if (res.data.statusCode == 100002) {//用户中途解绑
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg + '请重新绑定',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.reLaunch({
                  url: "../index/index"
                })
              }
            }
          })
        } else if (res.data.statusCode == 100009) {
          wx.showModal({
            title: "温馨提示",
            content: "此城市暂未开通此服务，敬请期待",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../logs/logs',
                })
              }
            }
          })
        } else if (res.data.statusCode == 100011) {
          wx.showModal({
            title: "温馨提示",
            content: res.data.msg,
            showCancel: false
          })
        } else {
          wx.showModal({
            title: "温馨提示",
            content: "状态异常，获取二维码失败",
            showCancel: false
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "温馨提示",
          content: "获取二维码失败,请重新进入小程序",
          showCancel: false
        })
      }
    });
  }//extent
})    //page
//gy二维码公共函数-下载图片模式
// function move_d(e) {
// var _url = '后台地址';
// wx.request({
//   url: _url,
//   //请求报文体
//   data: [{
//     // id: "agentCode"
//   }],
//   method: 'POST',
//   header: {
//     'content-type': 'application/json'
//   },
//   success: function (res) {
//     //为00时表示成功，得到二维码的地址
//     if (res.data.code == '00') {
//       console.log("成功")
//       //下载文件二维码
//       wx.downloadFile({
//         url: res.data.body[0].URL,
//         success: function (res) {
//           //如果二维码中的id为固定值可以将图片保存到本地，否则不用保存
//           wx.saveFile({
//             tempFilePath: res.tempFilePath,
//             success: function (res) {
//               console.log("保存成功")
//               _that.setData({
//                 filePath: res.savedFilePath
//               })
//               console.log(res.savedFilePath)
//               try {
//                 //id为定值，则将保存的地址存入缓存，非定值则只需要setData就行
//                 wx.setStorageSync('filePath', res.savedFilePath)
//               } catch (e) {
//                 console.log(e)
//               }
//             },
//             fail: function (res) {
//               console.log("保存失败")
//               console.log(res)
//             }
//           })
//         }, fail: function (res) {
//           util.msg("错误", "通讯失败")
//           console.log(res)
//         }
//       })
//     } else {
//       console.log("错误")
//       util.msg("错误", res.data.msg)
//     }
//   },
//   fail: function () {
//     util.msg("错误", "通讯失败")
//     console.log(res)
//   }
// })
// }
//倒计时事件
function count_down(that, time) {
  timer = setInterval(function () {
    time -= 1;
    if (time <= 0) {
      // 每隔60s请求绘制一次
      that.extent();
      // move_d()
      time = 60;
    }
    console.log(time)
  }, 1000)
}