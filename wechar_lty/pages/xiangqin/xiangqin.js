//消费明细
const util = require("../../utils/util.js");
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bu: "",
    line: "",
    lineend: "",
    busCode: "",
    leixin: "",
    rmb: "",
    upLine: "",
    upTime: "",
    closeTime: "",
    // kahao: "11111111",
    daohao: "",
    modalFlag: true,
    vedw_text: ""
    // downCode: "downStationName",
    // downTime: "downSwipeTime",
    // condition: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    var that = this
    // 
    wx.request({
      url: app.globalData.url_all + 'xcxOrder/orderDetail?',
      data: { id: query.id },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
        that.setData({
          // 
          leixin: "一票制",
          // 
          rmb: query.rmb,
          line: res.data.obj.routeName,
          lineend: res.data.obj.endStation,
          busCode: res.data.obj.vehicleId,
          upLine: res.data.obj.stationName,
          // upTime: util.formatTime(new Date(parseInt(res.data.obj.upSwipeTime))),
          upTime: res.data.obj.swipeTime,
          closeTime: res.data.obj.modifyTime,
          daohao: res.data.obj.orderNo,
          // condition: true
        })
        //  判断 补 标识
        if (res.data.obj.type == 1) {
          that.setData({
            bu: true
          })
        }
        if (res.data.obj.type == 0) {
          that.setData({
            bu: false
          })
        }
        // 查询详情数据异常遮罩层
        if (res.data.statusCode == 999999) {
          that.setData({
            modalFlag: false,
            vedw_text: res.data.msg
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '温馨提示',
          content: '查询失败，请稍后重试',
          showCancel: false
        })
      }
    })
  },

  // 点击模态框返回上一层
  modalOk: function () {
    wx.navigateBack({
      delta: 1
    })
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