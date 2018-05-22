<!--  case '1'://failure故障申报 -->
<template>
  <div class="header_contier starColor">
        <div class="failure_header">
            <span>故障申报(工单) </span>
            <span>
                系统在使用过程中出现故障可在此处申报工单，我们将尽快处理
            </span>
        </div>
<form @submit="submit">
        <div class="type_selecter">
            <label for="name">类型</label>
            <em>*</em>
            <select name="select_o" v-model="user.Post">
                <option value="software" name="1">软件</option>
                <option value="hardware" name="2" selected="selected">硬件</option>
            </select>
        </div>

        <div class="type_text">
            <label for="textarea">描述</label>
            <em class="vaTop">*</em>            
            <textarea rows="18" v-model="user.Text"></textarea>
             <!-- cols="35" -->
        </div>

        <input type="submit" value="提交" class="click_sub">

</form>
<!-- 遮罩层 -->
        <transition name="bounce">
           <div v-if="show"  class="invitingTost phoneCodeModel" @click="clickMask">
             <img src="../../static/images/loading_green.gif" alt="">
             <p>{{plaseUser}}</p>
           </div>
        </transition>
<!--  -->
    </div>
</template>
<script>
export default {
  name: "failureDeclare",
  data() {
    return {
      plaseUser: "",
      show: false,
      user: {
        Post: "software",
        Text: ""
      }
    };
  },

  methods: {
    submit: function() {
      event.preventDefault();
      var that = this;
      if (that.user.Text == "") {
        (that.plaseUser = "请填写描述详情"), (that.show = true);
        return false;
      } else {
        //show与html中v-if对应
        that.show = false;
      }
      that.$loading.show("正在提交");
      // var submitERR = JSON.stringify(this.user);
      // console.log(submitERR);

      var openId = JSON.parse(localStorage.getItem("localUserData"));
      $.ajax({
        url: this.global.bastUrl + "malfunction_report",
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
            mr_type: that.user.Post,
            description: that.user.Text
          }
        }),
        success: function(res) {
          if (res.result.code == 10000) {
            that.$loading.hide();
            that.$loading.show("提交成功");
            that.user.Text = "";
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
  }
};
</script>

