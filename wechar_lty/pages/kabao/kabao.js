// 卡包
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    add_number: '',
    userListInfo: [{
      text: '交易记录',
      gt: '../../images/icon_arrow.png',
    },
    {
      text: '充值电子发票',
      gt: '../../images/icon_arrow.png',
    },
    {
      text: '开通路线',
      gt: '../../images/icon_arrow.png',
    },
    {
      text: '公交卡详情',
      gt: '../../images/icon_arrow.png',
    },
    {
      text: '公众号',
      gt: '../../images/icon_arrow.png',
      // isunread: true,
      // unreadNum: 2
    }]
  },
  /**
   * list循环跳转事件
   */
  list_to: function (e) {
    if (e.currentTarget.dataset.index == 0) {
      // wx.navigateTo({
      //   url: '../trading/trading'
      // });
      wx.showToast({
        title: '正在开发中...',
        duration: 1800,
        mask: true
      })
    } else if (e.currentTarget.dataset.index == 1) {
      wx.showToast({
        title: '正在开发中...',
        duration: 1800,
        mask: true
      })
    } else if (e.currentTarget.dataset.index == 2) {
      wx.navigateTo({
        url: '../line/line'
      });
    } else if (e.currentTarget.dataset.index == 3) {
      wx.navigateTo({
        url: '../details/details'
      });
    } else if (e.currentTarget.dataset.index == 4) {
      // wx.navigateTo({
      //   url: '../BT_guangzhou/BT_guangzhou'
      // });
      wx.showToast({
        title: '正在开发中...',
        duration: 1800,
        mask: true
      })
    }
  },
  /**
   * 刷吗乘车跳转
   */
  tosucceed_tab: function (e) {
    wx.switchTab({
      url: "../hkmovie/hkmovie"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})