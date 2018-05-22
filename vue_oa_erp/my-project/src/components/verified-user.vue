<template>
  <div class="header_contier">

        <div class="inlet_top">
            <div class="inlet_img postionRel">
              <img :src="headPortrait" alt="" class="headPortrai">
                <img :src="userImage" alt="VIP" class="vipIcon">
            </div>
            <div class="inlet_span">
                <span class="inlet_span_h3 userName">{{userName}}</span>
                <span class="inlet_span_h4 userObj">{{userObj}}</span>                
                <span class="inlet_span_h5 userPost">{{userPost}}</span>
            </div>
        </div>

        <div class="phone_postion position_r" @click="telPhone">
            <img :src="administratorImage" alt="" class="vipTelicon">
            <div> 您的服务专员：{{administratorName}} {{administratorPhone}}</div>
        </div>

        <div class="feature">
          <div class="Failure_declare" v-for="(item,index) in item_divList" :key="index" @click="featureList(index)" :value="index">
              <img :src="item.iconImage" alt="">
              <span>{{item.msg}}</span>
           </div>
     
        </div>
    </div>
</template>

<script>
export default {
  name: "verified-user",
  data() {
    return {
      userName: "",
      userObj: "",
      userPost: "",
      administratorPhone: "4006881850",
      administratorName: "蓝泰源",
      headPortrait: "",
      userImage: "./static/images/passVip.png",
      administratorImage: "./static/images/tel.png",
      // iconImage: "./static/images/@2x.png",
      item_divList: [
        {
          msg: "故障申报",
          iconImage: "./static/images/Failure_declare.png"
        },
        {
          msg: "工单查询",
          iconImage: "./static/images/2order_query.png"
        },
        {
          msg: "硬件返修",
          iconImage: "./static/images/hardware_repair.png"
        },
        {
          msg: "返修查询",
          iconImage: "./static/images/4repair_enquiry.png"
        },
        {
          msg: "投诉与建议",
          iconImage: "./static/images/complaints_suggestions.png"
        },
        {
          msg: "处理进度",
          iconImage: "./static/images/6processing_progress.png"
        },
        {
          msg: "邀请同事",
          iconImage: "./static/images/inviting_colleague.png"
        },
        {
          msg: "我的邀请",
          iconImage: "./static/images/8my_invitation.png"
        }
      ]
    };
  },
  methods: {
    featureList(index) {
      console.log(index);
      switch (index) {
        case 0: //故障申报
          this.$router.push({ path: "/failureDeclare" });
          break;
        case 1: //工单查询
          this.$router.push({ path: "/orderQuery" });
          break;
        case 2: //硬件返修
          this.$router.push({ path: "/hardwareRepair" });
          break;
        case 3: //返修查询
          this.$router.push({ path: "/repairEnquiry" });
          break;
        case 4: //投诉与建议
          this.$router.push({ path: "/complaintsSuggestions" });
          break;
        case 5: //处理进度
          this.$router.push({ path: "/processingProgress" });
          break;
        case 6: //邀请同事
          this.$router.push({ path: "/invitingColleague" });
          break;
        case 7: //我的邀请
          this.$router.push({ path: "/myLnvitation" });
          break;
        default:
          break;
      }
    },
    telPhone() {
      var that=this;
      window.location.href = 'tel:'+parseInt(that.administratorPhone);
    }
  },
  created: function() {
    var that = this;
    var openId = JSON.parse(localStorage.getItem("localUserData"));
    $.ajax({
      url: this.global.bastUrl + "partner_info",
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
        params: { openid: openId.openid }
      }),
      success: function(res) {
        // console.log(res.result.data.headimg_data);
        (that.userName = res.result.data.name),
          (that.userObj = res.result.data.function),
          (that.userPost = res.result.data.company),
          (that.headPortrait =
            "data:image/png;base64," + res.result.data.headimg_data);
        if (res.result.data.salesman_mobile) {
          that.administratorPhone = res.result.data.salesman_mobile;
        }
        if (res.result.data.salesman_name) {
          that.administratorName = res.result.data.salesman_name;
        }
      },
      error: function() {}
    });
  }
};
</script>

<style scoped>

</style>


