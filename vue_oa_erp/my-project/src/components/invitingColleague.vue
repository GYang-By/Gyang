<!-- 邀请同事7：inviting_colleague.html -->

<template>
    <div class="header_contier starColor">
        <div class="failure_header">
            <span>邀请同事</span>
            <span>
                邀请您的同事，他将获得星级认证权限。<br>
               获取星级认证权限后有助于我们为您提供更好的服务。
            </span>
        </div>
<form @submit="submit" class="invitingColleagueForm">
        <div class="left_name">
            <img src="../../static/images/touxiang1.png" alt="">
            <label for="nub_labelId">姓名</label>
            <em>*</em>                           
            <input type="text" id="nub_labelId" v-model="exName" required="required">
        </div>

        <div class="left_name positionTost">
            <img src="../../static/images/phoneicon.png" alt="">          
            <label for="pho_lableId">电话</label>
            <em>*</em>                                    
            <input type="tel" id="pho_lableId" v-model="exPhone" required="required" maxlength="11">

<!-- 与下面冲突 -->
            <!-- <transition name="bounce">
           <p v-if="show"  class="invitingTost">! 请填写正确手机号</p>
        </transition> -->

        </div>
        <div class="phone_explain">(电话号码非常重要，是星级验证的必要条件)</div>

        <div class="left_name">
            <img src="../../static/images/shengfenzheng.png" alt="">
            <label for="post_lableId">岗位</label>
            <em>*</em>                                    
            <input type="text" id="post_lableId" v-model="exLableId" required="required">
        </div>
        <div class="phone_explain">(正确的岗位信息有助于我们提供更加精准的服务)</div>

        <input type="submit" value="提交" class="click_sub">
</form>

        <transition name="bounce">
           <div v-if="show"  class="invitingTost phoneCodeModel" @click="clickMask">
             <img src="../../static/images/loading_green.gif" alt="">
             <p>{{plaseUser}}</p>
           </div>
        </transition>

    </div>
</template>
<script>
export default {
  name: "invitingColleague",
  data() {
    return {
      plaseUser: "",
      show: false,
      exName: "",
      exPhone: "",
      exLableId: ""
    };
  },
  methods: {
    submit: function() {
      event.preventDefault();
      var that = this;
      var openId = JSON.parse(localStorage.getItem("localUserData"));
      var telPhone = that.exPhone;
      if (!isTelCode(telPhone)) {
        (that.plaseUser = "请填写正确的手机号"), (that.show = true);
        return false;
      } else {
        //show与html中v-if对应
        that.show = false;
      }
      function isTelCode(str) {
        var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
        return reg.test(str);
      }
      that.$loading.show("正在提交");

      $.ajax({
        url: that.global.bastUrl + "colleague_invite",
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
            openid: openId.openid,
            name: that.exName,
            co_mobile: that.exPhone,
            function: that.exLableId
          }
        }),
        success: function(res) {
          if (res.result.code == 10000) {
            that.$loading.hide();
            that.$loading.show("提交成功");
            (that.exName = ""), (that.exPhone = ""), (that.exLableId = "");
            setTimeout(() => {
              that.$loading.hide();
            }, 1500);
          } else {
            that.$loading.hide();
            that.$loading.show("提交失败");
            setTimeout(() => {
              that.$loading.hide();
            }, 1800);
          }
        },
        error: function() {
          that.$loading.hide();
          that.$loading.show("提交失败");
          setTimeout(() => {
            that.$loading.hide();
          }, 1800);
        }
      });
    },
    // 取消遮罩层
    clickMask() {
      this.show = false;
    }
    // showLoading() {
    //   this.$loading.show();
    // },
    // hideLoading() {
    //   this.$loading.hide();
    // }
  }
};
</script>
