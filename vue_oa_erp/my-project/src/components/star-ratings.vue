<!-- 注册登录页面 -->
<template>
    <div class="header_contier starColor">
        <div class="starRating_header">
            <span>星级认证 - 受访用户认证</span>
            <span>
                认证星级用户后您将获得我司的专项服务。<br> 受访用户必须在我司系统中有VIP权限方可认证通过，您可以要求我司工作人员为您添加VIP记录，也可让您身边已经通过星级认证的同事邀请您加入来为您获得VIP权限
            </span>
        </div>

        <div class="form-wrapper">
                <div class="form">
                    <div class="form-item">
                        <div class="form-itemLeft">
                            <img :src="phoneIcon" alt="">
                            电话
                        </div>
                        <input type="tel" name="text" required="required" autocomplete="on" maxlength="11" v-model="exphone" v-on:input="inputChange">

                        <img :src="ximg" alt="" class="xDel" v-show="delShow" @click="delVlue">
                    </div>
                    <button v-bind:disabled="disabled" class="getPassCode" @click="getCode">{{getCodeTime}}{{stargetCode}}</button>

                    <div class="form-item">
                         <div class="form-itemLeft">
                            <img :src="passCodeIcon" alt="">
                            验证码
                        </div>
                        <input type="number" name="text" autocomplete="on" v-model="exCode">
                    </div>
                    <div class="button-panel">
                        <input type="button" class="button" title="Sign In" value="验证" @click="to_vUser">
                         <!-- type="submit" 无提交数据，移动端会拉取键盘-->
                    </div>
                </div>
        </div>

        <transition name="bounce">
           <div v-if="show"  class="invitingTost phoneCodeModel" @click="clickMask">
             <img src="../../static/images/loading_green.gif" alt="">
             <p>{{plaseUser}}</p>
           </div>
        </transition>
    </div>
</template>

<script>
// 登陆样式动画
// import fort_demo from "../assets/commom.js/fort_demo.js";
export default {
  name: "starRating",
  data() {
    return {
      stargetCode: "获取验证码",
      getCodeTime: "",
      delShow: false,
      plaseUser: "",
      show: false,
      disabled: false,
      ximg: "./static/images/X.png",
      passCodeIcon: "./static/images/passcode.png",
      phoneIcon: "./static/images/phoneicon.png",
      exphone: "",
      exCode: ""
    };
  },

  mounted() {},

  methods: {
    // 获取验证码
    getCode() {
      var that = this;
      var telPhone = that.exphone;
      if (!isTelCode(telPhone) || telPhone == "") {
        (that.plaseUser = "请填写正确的手机号"), (that.show = true);
        return false;
      } else {
        //show与html中v-if对应
        that.show = false;
        // 验证码时间flag
        that.getCodeTime = 60 + "s";
        let time = setInterval(() => {
          let msg = parseInt(that.getCodeTime);
          msg -= 1;
          that.stargetCode = "后重新获取";
          that.getCodeTime = msg + "s";
          that.disabled = true;
          if (msg == 0) {
            clearInterval(time);
            that.stargetCode = "获取验证码";
            that.getCodeTime = "";
            that.disabled = false;
          }
        }, 1000);
      }

      // 发送短信
      // var openId = JSON.parse(localStorage.getItem("localUserData"));
      $.ajax({
        url: that.global.bastUrl + "msg_send",
        type: "POST",
        cache: false,
        // xhrFields: {
        //   withCredentials: true
        // },
        // crossDomain: !document.all === true,
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: { openid: that.global.bastOpenId.openid, mobile: telPhone }
        }),
        success: function(res) {
          if (res.result.code == 10060) {
            that.$loading.show(res.result.msg);
            setTimeout(() => {
              that.$loading.hide();
            }, 1500);
          }
        },
        error: function() {
          that.$loading.show("短信发送失败");
          setTimeout(() => {
            that.$loading.hide();
          }, 2400);
        }
      });

      // 手机号验证
      function isTelCode(str) {
        var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
        return reg.test(str);
      }
    },
    // 取消遮罩层
    clickMask() {
      this.show = false;
    },

    //登陆验证
    to_vUser() {
      var _this = this;
      //
      if (!_this.exphone) {
        (_this.plaseUser = "请填写正确的手机号"), (_this.show = true);
        return false;
      }
      if (!_this.exCode) {
        (_this.plaseUser = "请填写正确的验证码"), (_this.show = true);
        return false;
      }

      _this.$loading.show("正在验证");

      $.ajax({
        url: _this.global.bastUrl + "partner_auth",
        type: "POST",
        cache: false,
        // xhrFields: {
        //   withCredentials: true
        // },
        // crossDomain: !document.all === true,
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            openid: _this.global.bastOpenId.openid,
            mobile: _this.exphone,
            msg_code: _this.exCode
          }
        }),
        success: function(res) {
          // _this.$router.replace({ path: "/verified-user" });
          _this.$loading.hide();
          if (res.result.code == 10020) {
            _this.$router.replace({ path: "/verified-user" });
          } else if (res.result.code == 10040) {
            _this.$loading.show("该手机号已被认证");
            setTimeout(() => {
              _this.$loading.hide();
            }, 3000);
          } else if (res.result.code == 10030) {
            _this.$loading.show("非受访用户");
            setTimeout(() => {
              _this.$loading.hide();
            }, 3000);
          } else {
            _this.$loading.show(res.result.msg);
            setTimeout(() => {
              _this.$loading.hide();
            }, 3000);
          }
        },
        error: function() {
          _this.$loading.hide();
          _this.$loading.show("认证失败");
          setTimeout(() => {
            _this.$loading.hide();
          }, 3000);
        }
      });
    },

    // input输入事件
    inputChange() {
      this.delShow = true;
    },

    // x清空事件
    delVlue() {
      (this.exphone = ""), (this.delShow = false);
    }
  }
};
</script>

<style scoped>
@import "../assets/commin.css/signdemo_style.css";
/* @import "../assets/commin.css/signdemo_fort.css"; */
</style>