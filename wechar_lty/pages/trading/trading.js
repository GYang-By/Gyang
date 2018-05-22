// 交易记录
var app = getApp();
// const util = require("../../utils/util.js");
var datap, time, texto, ID;
var data_list = [];
var pageNo;
var openId_datap;
var scrollHeight;
Page({
  data: {
    scrollTop: 0,
    scrollHeight: 0,
    hasUserInfo: false,
    userInfo: {},
    text: "消费",
    none_scroll: false,
    none_doc: false,
    none_down: false,
    userListInfo: [
      // {
      //   time: "11111",
      //   texto: '',
      //   type: "",
      // },
    ]
  },
  onLoad: function () {
    pageNo = 1;
    console.log("pageNo" + pageNo)
    var that = this;
    openId_datap = wx.getStorageSync('mdkey').open;
    // 获取视口数据
    wx.getSystemInfo({
      success: function (res) {
        scrollHeight = res.windowHeight;
        console.log(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    // 加载时请求一次
    GetList(that);
  },
  // 上拉加载
  bindDownLoad: function () {
    var that = this;
    GetList(that);
  },
  // 滚动监听
  scroll: function (event) {
    console.log(event);

    this.scrollTop = event.detail.scrollTop;

    // this.setData({
    //   scrollTop: event.detail.scrollTop
    // });
    if (event.detail.scrollHeight - 50 < (event.detail.scrollTop) + scrollHeight) {
      console.log(event.detail.scrollHeight);
      console.log((event.detail.scrollTop) + scrollHeight);
      // 50的显示高度，超过50底部隐藏
      this.setData({
        none_down: false,
      });
    }
  },
  // 
  onHide: function () {
    pageNo = 1;
    console.log("onHide-pageNo" + pageNo++)
  },
  onUnload: function () {
    pageNo = 1;
    console.log("onUnload-pageNo" + pageNo++)
  },

  onPullDownRefresh: function () {
    console.log("下拉");

    // 4.3----3.4bate
    var that = this;    
    pageNo = 1;    
    GetList(that);
    // 
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数,DOM事件
   */
  onReachBottom: function () {
    console.log("上拉")
  },
  onclick: function (e) {
    var index = e.currentTarget.dataset.index;
    var userid = this.data.userListInfo[index].ID;
    var rmb = this.data.userListInfo[index].texto;
    wx.navigateTo({
      url: '../xiangqin/xiangqin?id=' + userid + '&rmb=' + rmb + ''
    });
  }
})

function GetList(that) {
  wx.showLoading({
    title: '加载中· · ·',
  });
  wx.request({
    url: app.globalData.url_all + 'xcxOrder/queryOrder?',
    data: { openId: openId_datap, pageNo: pageNo },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log("pageNo" + pageNo)

      // 关闭loading
      wx.hideLoading();
      
      // 判断有无数据处理情况
      if (res.data.obj.list == "") {
        that.setData({
          none_doc: true,
        });
        that.update();
        return false
      } else {
        that.setData({
          none_scroll: true,
        })
      };
      if (pageNo > res.data.obj.pages) {
        that.setData({
          none_down: true,
        })
        return false
      };
      for (var i = 0; i < res.data.obj.list.length; i++) {
        var rs = res.data.obj.list[i];
        var time_o = rs.modifyTime;
        var type_a = rs.type;
        // var time = util.formatTime(new Date(parseInt(time_o)));
        var texto = rs.price;
        var ID = rs.id;
        var obj = {
          time: time_o,
          texto: texto,
          ID: ID,
          type_a: parseInt(type_a)
        }
        data_list.push(obj);
        // 过滤-调用下面方法
        data_list = uniqeByKeys(data_list, ['ID']);
      }
      that.setData({
        userListInfo: data_list
      })
      console.log(data_list)
      // var l = that.data.list;
      // for (var i = 0; i < res.data.obj.list.length; i++) {
      //   l.push(res.data[i])
      // }
      // that.setData({
      //   userListInfo: l
      // });
      pageNo++;
      // that.setData({
      //   hidden: true
      // });
    }
  });
}

// 数据重复过滤
function obj2key(obj, keys) {
  var n = keys.length,
    key = [];
  while (n--) {
    key.unshift(obj[keys[n]]);
  }
  return key.join('|');
}
//去重操作-----传入数组和判断标识
function uniqeByKeys(all_array, keys) {
  var arr = [];
  var hash = {};
  for (var i = 0, j = all_array.length; i < j; i++) {
    var k = obj2key(all_array[i], keys);
    if (!(k in hash)) {
      hash[k] = true;
      arr.push(all_array[i]);
    }
  }
  return arr;
}  