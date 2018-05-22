<template>
  <div class="header_contier">
        <div class="inlet_top">
            <div class="inlet_img">
                <img :src="headPortrait" alt="" class="userInfo">
                <span>待认证</span>
            </div>
            <div class="inlet_span">
                <span class="inlet_span_h3">{{nickname}}</span>
                <span class="inlet_span_h5">待认证客户</span>
                <span class="pointSj"><img :src="point">请认证您的资料</span>
            </div>
        </div>

        <div class="phone_postion">
            <img :src="starTarget">
            
            星级用户认证咨询电话：<a href="tel:400 688 1850">400 688 1850</a></div>

        <div class="subject">
            <div id="ratings" @click="toUser" class="ofTheuser">
                <img :src="ofTheuser" alt="">
                <span>受访用户</span>
                <span>(蓝泰源拜访过您)</span>
            </div>
            <div class="unOftheuser" :class="activeCss" @click="activeCssFlag">
                <img :src="unOftheuser" alt="">
                <span>非受访用户</span>
                <span>(未和蓝泰源拜建立往来)</span>
            </div>
        </div>

        <div class="hint">
                <span class="tips_h4">Tips:</span>
                <ol>
                    <li>1.受访用户可通过电话号码快速认证</li>
                    <li>2.非受访用户需通过上传身份证照片、公共交通事业从业证件进行认证。</li>
                </ol>
            </div>
    </div>
</template>

<script>
export default {
  name: "unverfied",
  data() {
    return {
      // 动态类名
      activeCss: "",
      nickname: "",
      unOftheuser: "./static/images/unOftheuser.png",
      ofTheuser: "./static/images/ofTheuser.png",
      starTarget: "./static/images/starTarget.png",
      headPortrait: "./static/images/touxiang.png",
      point: "./static/images/pointaj.png"
    };
  },
  methods: {
    toUser() {
      this.$router.push({ path: "/ratings" });
    },
    activeCssFlag() {
      this.activeCss = "activeCss";
      setTimeout(() => {
        this.activeCss = "";
      }, 1000);
    }
  },
  mounted() {
    document.body.style.margin = "0";
  },
  created: function() {
    console.log(localStorage.getItem("localUserData"));
    let UserData = JSON.parse(localStorage.getItem("localUserData"));
    //   openid: "o9HYEt3oaf3K5dNVW-bQzH1YWJzM",
    //   headimgurl:
    //     "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKuN1C5QkB6ia5HcdqJYib7IEI36uZicmKGykjuYjhqBsANVBCkuDc96q3rR0gJdhdUTv71yDSV8qnOg/132",
    //   unionid: "olfuOt7pWkDPd_MRvzVxEc5Mnwjk",
    //   nickname: "Zytan"
    if (UserData.nickname) {
      this.nickname = UserData.nickname;
    } else {
      this.nickname = "游客";
    }
    this.headPortrait = UserData.headimgurl;
  }
};
</script>

<style scoped>
/* @import "./assets/commin.css/commom.css"; */
</style>
