// 
const preventEvent = require("../../utils/prevent.js");
// 
var app = getApp()
Page({
  data: {
    name: "",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    userListInfo: [{
      icon: '../../images/icon_orders.png',
      text: '交易记录',
      gt: "../../images/icon_arrow.png",
      // isunread: true,
      // unreadNum: 2,
    }, {
      icon: '../../images/icon_route.png',
      text: '开通线路',
      gt: "../../images/icon_arrow.png",
      // isunread: true,
      // unreadNum: 2
    }]
  },

  // onLoad: function () {
  //   var that = this
  //   //调用应用实例的方法获取全局数据
  //   app.getUserInfo(function (userInfo) {
  //     //更新数据
  //     that.setData({
  //       userInfo: userInfo
  //     })
  //   })
  // }
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

  onLoad: function () {
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
    }
  },
  // 如果为取到用户明码信息，点击主动获取
  bindViewTap: function () {
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  // li判断跳转
  my_to: function (e) {
    // 防止多次点击
    preventEvent.preventEvent(this);
    if (e.currentTarget.dataset.index == 0) {
      wx.navigateTo({
        url: '../trading/trading'
      });

      // wx.showToast({
      //   title: '正在开发中...',
      //   duration: 1800,
      //   mask: true
      // })
    } else {
      // wx.navigateTo({
      //   url: '../line/line'
      // });
      wx.showToast({
        title: '正在开发中...',
        duration: 1200,
        mask: true
      })
    }
  }
})