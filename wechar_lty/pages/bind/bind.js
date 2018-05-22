// 进入小程序 拉取第三方  绑定
// 
const prevent = require("../../utils/prevent.js");
// 
var md55 = require("../../utils/md5.js");
const random_t = require("../../utils/util.js");
const app = getApp();
var timestamp = (Date.parse(new Date())).toString().slice(0, 10);   //1514978954000格式  截取
var sign = '';
var sign_tlephone;            //用户手机号
var contract_code;        //商户侧的签约协议号
var sgin_city_code;        //获取城市ID缓存
// 主体商户
var mchId;
var planId;
var sign_key;
Page({
  data: {
    er_o: "#2ab650",
    er_t: "#999",
    isChecked: false,
    che_right: "../../images/icon_users_nor.png",
    che_left: "../../images/icon_qr_code_select.png",
    hidden: true
  },
  checkboxChange: function (e) {
    if (this.data.isChecked == true) {
      this.setData({
        isChecked: false
      })
    } else {
      this.setData({
        isChecked: true
      })
    }
    console.log(e.detail);
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
  },
  // 页面加载
  onLoad: function (options) {
    // 时间错-----sgin
    console.log(timestamp);

    // 获取城市ID缓存----sign
    try {
      sgin_city_code = wx.getStorageSync('city_code')
      console.log(sgin_city_code)
    } catch (e) {
      wx.showModal({
        title: '温馨提示',
        content: "城市ID获取失败，请重新进入小程序",
        showCancel: false
      })
    };

    // 取手机号缓存---sgin
    sign_tlephone = wx.getStorageSync('telePhonesync');
    console.log(sign_tlephone);

    // 动态取商户主体信息
    wx.request({
      url: app.globalData.url_all + 'xcxAccount/accountInfo',
      data: { cityCode: sgin_city_code },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
        mchId = res.data.obj.mchId;
        planId = res.data.obj.planId;
        sign_key = res.data.obj.sign;
       
        sign_join();
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '温馨提示',
          content: "请重新进入签约商户",
          showCancel: false
        })
      },
    });
  },

  // 底部TAB添加点击事件
  hide: function (e) {
    this.setData({
      che_right: "../../images/icon_users_select.png",
      che_left: "../../images/icon_qr_code_nor.png"
    })
  },
  // 右下角
  show: function (e) {
    this.setData({
      che_right: "../../images/icon_users_select.png",
      che_left: "../../images/icon_qr_code_nor.png",
      er_t: "#2ab650",
      er_o: "#999",
      hidden: !this.data.hidden
    })
    // 调试跳转----后期刷调
    // wx.switchTab({
    //   url: '../logs/logs',
    // })
  },
  // 主动取消弹出层
  open: function (e) {
    this.setData({
      hidden: true
    })
  },
  // 正常跳转事件
  gotoAuto_one: function (e) {
    if (this.data.isChecked == true) {
      // 绑定flag
      prevent.preventEvent(this)

      //此处事件拉起第三方签约
      wx.navigateToMiniProgram({
        appId: 'wxbd687630cd02ce1d',
        path: 'pages/index/index',
        extraData: {
          appid: 'wx1f9cc37b19887ab4',          //发起签约的小程序 appid
          mch_id: mchId,                 //公司商户号-1301124501  黄山--1495323132
          notify_url: app.globalData.sign_callback,
          contract_code: contract_code,   //商户侧的签约协议号由商户生成商户侧须唯一20180104115943HHdgy
          contract_display_account: sign_tlephone,  //签约用户的名称，用于页面展示 GYang
          plan_id: planId,                    //公司协议模板 id--115409    黄山--109209
          request_serial: timestamp,            //请求签约序列号             1515037276
          timestamp: timestamp,                 //时间戳-系统当前时间        1515037276
          sign: sign   //签名
        },
        success(res) {
          console.log('签约绑定页成功返回状态并存储' + res)
          // wx.switchTab({
          //   //绑定成功微信方有成功提示页面，直接跳转至二维码
          //   url: "../hkmovie/hkmovie"
          // })
        },
        fail(res) {
          // 未成功跳转到签约小程序
        },
        complete(res) {
          // 调用成功、失败都会执行
        }
      });
    } else {
      this.setData({
        isChecked: false
      })
    };
  },
  //FALG防止多次点击
  prevent_vent: function () {
    prevent.preventEvent(this)
  }
})//page

// 页面显示开始生产签名
function sign_join() {
  // 随机生辰的时间+随机字符串-2018 / 01 / 04 11:43:172f2Ol-----sgin
  var str1 = (random_t.formatTime(new Date()) + makeid()).split(/-|:|\/|，| |\r|\n/);
  contract_code = str1.join('');//or1
  // contract_code = md55.MD5(timestamp + makeid()).toUpperCase();//or2--mad加密的
  console.log(contract_code);

  var signA = 'appid=wx1f9cc37b19887ab4&contract_code=' + contract_code + '&contract_display_account=' + sign_tlephone + '&mch_id=' + mchId + '&notify_url=' + app.globalData.sign_callback + '&plan_id=' + planId + '&request_serial=' + timestamp + '&timestamp=' + timestamp + '&key=' + sign_key;//gy

  console.log(signA);
  sign = md55.MD5(signA).toUpperCase();
  console.log(sign);
};

// 随机窜
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
