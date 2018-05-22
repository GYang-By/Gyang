<!-- 投诉与建议5 complaints_suggestions  -->
<template>
  <div class="header_contier starColor">
        <div class="failure_header">
            <span>投诉与建议</span>
            <span>
                    我们的成长离不开您的建议和监督
            </span>
        </div>
    <form>
        <div class="type_selecter">
            <label for="name">类型</label>
            <em>*</em>                        
            <select name="select_o" v-model="user.Post">
                <option value="complaint" name="1">投诉</option>
                <option value="suggestion" name="2" selected="selected">建议</option>
            </select>
        </div>  
        <div class="type_text">
            <label for="textarea">内容</label>
            <em class="vaTop">*</em>                        
            <textarea rows="18" cols="40" id="textarea" v-model="user.Text"></textarea>
        </div>
        <input type="button" value="提交" class="click_sub" @click="submitClick();return false">
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
  name: "complaintsSuggestions",
  data() {
    return {
      plaseUser: "",
      show: false,
      user: {
        Post: "complaint",
        Text: ""
      }
    };
  },
  // mounted() {
  //   this.heIght = document.documentElement.clientHeight;
  // },
  methods: {
    submitClick: function() {
      // var submitERR = JSON.stringify(this.user); //表单数据
      // console.log(submitERR);
      var that = this;
      if (that.user.Text == "") {
        (that.plaseUser = "请填写内容详情"), (that.show = true);
        return false;
      } else {
        //show与html中v-if对应
        that.show = false;
      }
      var openId = JSON.parse(localStorage.getItem("localUserData"));
      that.$loading.show("正在提交");

      $.ajax({
        url: that.global.bastUrl + "feedback",
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
            fd_type: that.user.Post,
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
    //点击click事件触发机制
    // showLoading() {
    //   // 全局调用loading加载组件
    //   this.$loading.show("提交成功");
    // }
    // hideLoading() {
    // 全局调用loading加载动画组件
    //   this.$loading.hide();
    // }
  }
};
</script>

