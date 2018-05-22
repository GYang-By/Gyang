<template>
  <div id="app">
    <!-- <router-view/> -->
    <!-- 组件缓存机制 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!--  -->
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      msg: false
    };
  },
  // 入口判断
  created: function() {
    // 全局变量
    console.log(this.global.bastUrl);

    // if (!this.msg) {
    //   console.group("created 创建完毕状态===============》");

    //   this.$router.push("/verified-user");
    // }


    let UserData = {
      openid: "o9HYEt3oaf3K5dNVW-bQzH1YWJzM",
      headimgurl:
        "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKuN1C5QkB6ia5HcdqJYib7IEI36uZicmKGykjuYjhqBsANVBCkuDc96q3rR0gJdhdUTv71yDSV8qnOg/132",
      unionid: "olfuOt7pWkDPd_MRvzVxEc5Mnwjk",
      nickname: "Zytan"
    };
    // let UserData = wechatUser;


    localStorage.setItem("localUserData", JSON.stringify(UserData));

    let that = this;

    $.ajax({
      url: this.global.bastUrl + "check_auth",
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
        params: { openid: UserData.openid }
      }),
      success: function(res) {
        if (res.result.code == 10040) {
          // that.$router.push("/verified-user");
          that.$router.replace({ path: "/verified-user" });
        }
      },
      error: function() {}
    });
  }
};
</script>

<style>

</style>

