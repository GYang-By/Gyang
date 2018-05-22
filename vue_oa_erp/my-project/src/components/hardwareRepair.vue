<!-- 硬件返修3 hardware_repair.html -->
<template>
   <div class="header_contier starColor">
        <div class="failure_header">
            <span>硬件返修</span>
            <span>
                您购买的硬件产品需要寄回我司返修时请填写此单对您的设备进行跟踪。
            </span>
        </div>
<form @submit="submit">
        <div class="type_selecter">
            <label for="name">快递名称</label>
            <em>*</em>
            <select v-model="selected" name="select_o" class="selectWidth70">
              <option disabled value="">请选择快递公司</option>
                <option name="1" v-for="optionList in optionData" v-bind:value="optionList.englishV">{{optionList.msg}}</option>
            </select>
        </div>

        <div class="type_text">
            <label for="inp_text">快递单号</label>
            <em class="vaTop">*</em>
            <input type="text" id="inp_text" v-model="user.Text" required="required">
        </div>

        <span class="package_content">包裹内容</span>
            <em>*</em>
        <table border="0" cellspacing="0" class="table_add">
            <tr>
                <th>品名</th>
                <th>数量</th>
                <th>故障描述</th>
            </tr>
            <tr v-for="(trList,index) in ag">
                <td contentEditable="true"><input type="text" v-model="ag[index].name" style="width:100%;height:100%;border-width:0"></td>
                <td contentEditable="true"><input type="text" pattern="^[1-9]\d*$" v-model="ag[index].count" style="width:100%;height:100%;border-width:0"></td>
                <td contentEditable="true"><input type="text" v-model="ag[index].malfunction_desc" style="width:100%;height:100%;border-width:0"></td>
            </tr>
        </table>
        <button class="hardware_repair_float" type="button" @click="addTable" :disabled="this.ag[this.ag.length - 1].malfunction_desc==''&& addFlag">添加</button>
        <button class="hardware_repair_float marginR5" type="button" @click="spliceTable" :disabled="ag.length<3">删除</button>
        
        <input type="submit" value="提交" class="click_sub maginTOP50">
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
  name: "hardwareRepair",
  data() {
    return {
      plaseUser: "",
      show: false,
      addFlag: true,
      selected: "",
      optionData: [
        // { englishV: "1", msg: "" }
      ],
      user: {
        // Post: "sf",
        Text: ""
      },
      ag: [
        {
          name: "",
          count: "",
          malfunction_desc: ""
        },
        {
          name: "",
          count: "",
          malfunction_desc: ""
        }
      ]
    };
  },
  created() {
    let that = this;
    $.ajax({
      url: this.global.bastUrl + "selection",
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
          type: "express_name"
        }
      }),
      success: function(res) {
        console.log(res.result.data);
        // // res.result.data.forEach(function(key, value) {
        //   debugger
        //   for (var p1 in element) {
        //     if (element.hasOwnProperty(p1))
        //       // keys1.push(p1);
        //       console.log(p1);

        //   }
        //       console.log(element);
        // });
        res.result.data.forEach(function(key, index) {
          that.optionData.nglishV = Object.keys(res.result.data[index]);
          that.optionData.msg = Object.values(res.result.data[index]);
          console.log(that.optionData.nglishV + ":" + that.optionData.msg);
          that.optionData.push({
            englishV: Object.keys(res.result.data[index]).toString(),
            msg: Object.values(res.result.data[index]).toString()
          });
        });
      }
    });
    //
  },
  mounted() {
    var self = this;
    setInterval(function() {
      console.log(self.ag[self.ag.length - 1].malfunction_desc);
    }, 115000);
  },
  methods: {
    addTable() {
      //添加
      this.ag.push({
        name: "",
        count: "",
        malfunction_desc: ""
      });
      Array.from(this.ag).forEach(element => {
        if (
          element.name != "" &&
          element.count != "" &&
          element.malfunction_desc != ""
        ) {
          this.addFlag = false;
        }
      });
      // var addAjax = JSON.stringify(this.ag);
    },

    spliceTable() {
      //删除
      this.ag.splice(this.ag.length - 1, this.ag.length);
    },

    submit: function() {
      event.preventDefault();

      var _that = this;
      // 判断快递
      if (_that.selected == "") {
        (_that.plaseUser = "请选择快递名称"), (_that.show = true);
        return false;
      }

      // 判断包裹内容
      if (
        _that.ag[0].name == "" ||
        _that.ag[0].count == "" ||
        _that.ag[0].malfunction_desc == ""
      ) {
        (_that.plaseUser = "请填写包裹详情"), (_that.show = true);
        return false;
      } else {
        //show与html中v-if对应
        _that.show = false;
      }
      //
      var submitSelected = _that.selected; //名称
      var submitERR = _that.user.Text; //快递单号
      var submitNUM = _that.ag; //包裹内容
      // 每一次表单全部数据
      // let ajaxData = {
      //   submitERR: submitERR,
      //   submitNUM: eval(submitNUM)
      // };
      //
      var openId = JSON.parse(localStorage.getItem("localUserData"));
      _that.$loading.show("正在提交");

      $.ajax({
        url: _that.global.bastUrl + "hardware_repair",
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
            express_name: submitSelected,
            courier_number: submitERR,
            packages: submitNUM
          }
        }),
        success: function(res) {
          if (res.result.code == 10000) {
            _that.$loading.hide("");
            _that.$loading.show("提交成功");
            setTimeout(() => {
              _that.$loading.hide("");
              // 情况列表
              _that.user.Text = "";
              _that.ag.length = 2;
              for (var i = _that.ag.length - 1; i >= 0; i--) {
                _that.ag[i].name = "";
                _that.ag[i].count = "";
                _that.ag[i].malfunction_desc = "";
              }
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
