
var city,//定位城市名
  code,  //城市ID
  lat,
  lng,
  StationName,//首页站点
  city_name,//选择城市名
  ste_line,
  set_ata,
  admin,
  miss;//历史记录标记，防止点击重复追加
// ---------------JQM页面加载自动定位----------------------------
$(document).on("pagebeforecreate", function (event) {

  map_s();

  // 从城市页面过来-----获取上个页面带过来的值
  city_name = getURLParameter("cityname");
  code = getURLParameter("citycode");//选择城市的ID与当前定位code一个模式，根据后台取用户选择code

  //-自定义的js函数，根据参数名取参数值
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
  };

  // 将用户选择的城市和code缓存，下次直接使用
  if (code) {
    city_name = city_name;
    code = code;
    localStorage.setItem("last_admin_city_name", city_name);
    localStorage.setItem("last_admin_code", code);
  }

  // 缓存判断---取缓存
  if (localStorage.getItem("last_admin_code")) {
    code = localStorage.getItem("last_admin_code");
    city_name = localStorage.getItem("last_admin_city_name");
    $(".back_city").text(city_name);
    console.log("换存" + code + ":" + city_name)
  };


  //无坐标0处理
  if (lat == undefined || lng == undefined) {
    lat = 0;
    lng = 0
  }

  // 定时器30s重新定位
  window.setInterval(map_s, 60000);

  //定位
  function map_s() {
    console.log("调用地图开始");
    //加载地图，调用浏览器定位服务
    var map, geolocation;
    map = new AMap.Map('iCenter', {//iCenter自定义承载元素，在页面显示用demo承载地图---hide_container
      resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function () {
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 100000,          //超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition: 'RB'
      });
      map.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
      AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });

    //解析定位结果成功----逆编码
    function onComplete(data) {
      console.log("逆编码" + data)
      console.log(data);
      // 当前人经纬度      
      lat = data.position.lat;
      lng = data.position.lng;
      console.log(lat);
      $.ajax({
        url: "http://restapi.amap.com/v3/geocode/regeo?key=0cc6e8843aa3ee5ed36fafda6e585f08&location=" + lng + "," + lat + "",
        data: {},
        type: "POST",
        dataType: "JSON",
        success: function (res) {
          console.log(res);
          if (!city_name) {
            city = res.regeocode.addressComponent.city;
            $(".back_city").text(city);
          };
          if (!code) {
            // code = res.regeocode.addressComponent.adcode;
            code = (res.regeocode.addressComponent.adcode).slice(0, 4) + "00";
          };
          // 地点街道
          var nul = res.regeocode.addressComponent.streetNumber.street;
          // 设置具体位置
          $(".orientation").text(nul);
          // 转码成功调用请求接口
          lng_lat();
        },
        error: function (res) {
          console.log(res);
          if (!city_name) {
            $(".back_city").text("选择定位");
          }
          // 失败情况设置具体位置
          $(".orientation").text("暂无数据");
          // 弹窗显示
          // sloder_tc();
        }
      })
    };

    //解析定位结果失败
    function onError(data) {
      console.log(data);
      if (!city_name) {
        $(".back_city").text("选择城市");
      }
    };
  }
});


// ----------------------JQM方法-主动事件-------------------

$(document).on("pageinit", "#pageone", function () {
  miss = 0;
  // 右上角判断逻辑处理标记
  var flag = false;

  // 点击搜索框
  $("#search").on("click", function () {
    miss++;

    // 优化代码前原本位置

    if (miss == 1 && code) {
      // 设置城市分类标识
      var city_code_key = 'city_' + code;

      //将缓存渲染----------线路
      var last_line_get = JSON.parse(localStorage.getItem("last_line"));
      var last_sta_get = JSON.parse(localStorage.getItem("last_ata"));
      var all_array = [];
      if (!last_line_get) {
        last_line_get = [];
      } else {
        last_line_get = last_line_get[city_code_key];
        if (!last_line_get) {
          last_line_get = [];
        }
        last_line_get = uniqeByKeys(last_line_get, ['routeid', 'endstation']);
      };
      if (!last_sta_get) {
        last_sta_get = [];
      } else {
        last_sta_get = last_sta_get[city_code_key];
        if (!last_sta_get) {
          last_sta_get = [];
        }
        last_sta_get = uniqeByKeys(last_sta_get, ['stationid']);
      };

      // 线路满20站点不能追加处理
      if (last_line_get.length >= 20 && last_sta_get.length > 0) {
        last_line_get = last_line_get.slice(0, (20 - last_sta_get.length));
      }
      //--------

      all_array = last_line_get.concat(last_sta_get);
      // 过滤去重1
      // all_array = uniqeByKeys(all_array,['routeid','endstation']);
      // 2
      // var hash = {};
      // all_array = all_array.reduce(function (item, next) {
      //   hash[next.routeid] ? '' : hash[next.routeid] = true && item.push(next);
      //   return item
      // }, [])
      // 
      var all_length = (last_line_get.length) + (last_sta_get.length);
      if (all_length > 20) {
        var all_array_alise = all_array.slice(0, 20);
      } else {
        all_array_alise = all_array;
      }
      if (last_line_get && last_line_get.length != 0) {
        // var tag = '<ul class="yes_line">';
        $.each(all_array_alise, function (index, vl) {
          if (all_array_alise[index].routeid) {
            var tag = '<li endstation=' + all_array_alise[index].endstation + ' routename=' + all_array_alise[index].routename + ' routeid=' + all_array_alise[index].routeid + ' direction=' + all_array_alise[index].direction + '>';
            tag += '<div>' +
              '<img src="./images/icon_bus@2x.png" alt="">' +
              '<span>' + all_array_alise[index].routename + '</span>' +
              '</div>' +
              '<div>' +
              '<img src="./images/icon_arrow@2x.png" alt="">' +
              '<span>开往' + all_array_alise[index].endstation + '</span>' +
              '</div>';
            tag += '</li>';
            $(".yes_line").append(tag);
          }
        })
        // tag += '</ul>';
        // $(".yes_line").html(tag);

        // 点击历史记录线路跳转
        $(".yes_line").find('li').click(function () {
          var routeid = $(this).attr('routeid');
          var direction = $(this).attr('direction');
          var routename = $(this).attr('routename');
          var endstation = $(this).attr('endstation');
          location.href = "./line/line_page.html?routename=" + routename + "&citycode=" + code + "&lat=" + lat + "&lng=" + lng + "&routeid=" + routeid + "&direction=" + direction;
        })
      };//if

      //将缓存渲染----------站点
      if (last_sta_get && last_sta_get.length != 0) {
        // var tag = '<l class="yes_station">';
        $.each(all_array_alise, function (index, vl) {
          if (all_array_alise[index].bus_strlatitude) {
            var tag = '<li stationid=' + all_array_alise[index].stationid + ' bus_strlongitude=' + all_array_alise[index].bus_strlongitude + ' bus_strlatitude=' + all_array_alise[index].bus_strlatitude + ' routename=' + all_array_alise[index].routename + ' >';
            tag += '<img src="./images/icon_bus_plate@2x.png" alt="">' +
              '<span>' + all_array_alise[index].routename + '</span>';
            tag += '</li>';
            $(".yes_station").append(tag);
          }
        })

        // 点击历史记录站台跳转
        $(".yes_station").find('li').click(function () {
          var bus_strlongitude = $(this).attr('bus_strlongitude');
          var bus_strlatitude = $(this).attr('bus_strlatitude');
          var routename = this.innerText;
          var stationid = $(this).attr('stationid');
          location.href = "./stastion/station.html?stationid=" + stationid + "&routename=" + routename + "&citycode=" + code + "&lat=" + lat + "&lng=" + lng + "&StationName=" + StationName + "&bus_strlongitude=" + bus_strlongitude + "&bus_strlatitude=" + bus_strlatitude;
          // citycode: '610300', startlongitude: '107.17060', startlatitude: '34.346316', endlongitude: '107.131143', endlatitude: '34.359624' 
        });
      };//if
    };

    // ----上面代码执行顺序优化------
    // 点击态城市变取消并隐藏三角
    $(".back_city").text("取消");
    $(".saojiao").css({ visibility: " hidden" })

    // 点击主页面隐藏
    $("#show_hide").hide();
    if ($(".yes_line>li").length > 0 || $(".yes_station>li").length > 0) {
      // 有数据记录显示数据记录
      $("#info_yes").show();
    } else {
      // 无数据记录显示图片标记flag
      $("#hide_show").removeClass("hide").addClass("show");
      flag = true;
      $(".saojiao").css({ visibility: " hidden" })
    };
  });// 点击搜索框

  // 点击右上角事件
  $(".back_city").on("click", function () {
    if ($(".back_city")[0].innerText == "取消") {
      // 点击取消同X效果
      $("#search").val("");
      $("#info_yes").hide();
      $(".info_ches").removeClass("show").addClass("hide");
      $(".show_hide").removeClass("hide").addClass("show");

      // 变为当前城市
      if (!city_name) {
        $(".back_city").text(city);
      } else {
        $(".back_city").text(city_name);
      };
      $(".saojiao").css({ visibility: "inherit" })
      if (flag) {
        $("#hide_show").removeClass("show").addClass("hide");
        $("#show_hide").show();
      } else {
        $("#info_yes").removeClass("show").addClass("hide");
        $("#show_hide").show();
      }
    } else {
      window.location.href = "city/index.html?city=" + city;
    }
  });

  // 点击清空
  $(".both_has").on("click", function () {
    // 清空搜索对应
    // 清空缓存
    localStorage.removeItem("last_line");
    localStorage.removeItem("last_ata");
    $("#info_yes").remove();
    // 显示图片并标记
    $("#hide_show").addClass("show");
    flag = true;
  });

  // 小XXX伪元素---与stastion_list元素一样，后续如有input事件可能会冲突
  $(".ui-field-contain").on("click", ".ui-input-clear", function () {
    if ($("#search").val() == "") {
      $(".info_ches").html("");
      $(".info_ches").removeClass("show").addClass("hide");
      $(".show_hide").removeClass("hide").addClass("show");
      $("#info_yes").show();
    } else {
      $(".info_ches").addClass("show");
      $("#show_hide").addClass("show");
      $("#info_yes").hide();
    }
  });

  //输入框模糊查询
  $("#search").bind('input propertychange', function () {
    console.log(code)
    var kw = $(this).val();
    if (kw == "") {
      return false;
    };
    console.log(kw);
    $.ajax({
      url: URL_all + "/queryRouteStation/routeAndStation",
      data: { name: kw, citycode: code },
      type: "GET",
      dataType: "JSON",
      success: function (data) {
        console.log(data);
        var obj = data.obj.myPois;
        var num = data.obj.routes;
        var dim_sta = data.obj.stations;
        var tag = '<ul class="yes_line">';
        // 显示线路
        if (num) {
          $.each(num, function (index, eo) {
            tag += '<li class="num_line" endstation=' + eo.endstation + ' routename=' + eo.routename + ' routeid=' + eo.routeid + ' direction=' + eo.direction + '>' +
              '<div>' +
              '<img src="./images/icon_bus@2x.png" alt="">' +
              '<span>' + eo.routename + '</span>' +
              '</div>' +
              '<div>' +
              '<img src="./images/icon_arrow@2x.png" alt="">' +
              '<span>开往' + eo.endstation + '</span>' +
              '</div>' +
              '</li>';
          })
        };
        tag += '</ul>';
        $(".info_ches").html("");
        $(".info_ches").html(tag);
        // 站点数据
        // var tag = '<ul class="yes_station">';
        if (dim_sta) {
          $.each(dim_sta, function (index, eo) {
            var tag = '<li class="dim_sta_li" stationid=' + dim_sta[index].stationid + ' bus_strlongitude=' + dim_sta[index].longitude + ' bus_strlatitude=' + dim_sta[index].latitude + ' routename=' + dim_sta[index].name + ' >';
            tag += '<img src="./images/icon_bus_plate@2x.png">' +
              '<span>' + dim_sta[index].name + '</span>';
            tag += '</li>';
            $(".info_ches>.yes_line").append(tag);
          });
          // tag += '</ul>';
          // $(".info_ches").html("");
          // $(".info_ches").append(tag);
          // if (num){
          //   $.each(num, function (index, vl) {
          //   var tag = '<li endstation=' + num[index].endstation + ' routename=' + num[index].routename + ' routeid=' + num[index].routeid + ' direction=' + num[index].direction + '>';
          //   tag += '<div>' +
          //     '<img src="./images/icon_bus@2x.png" alt="">' +
          //     '<span>' + num[index].routename + '</span>' +
          //     '</div>' +
          //     '<div>' +
          //     '<img src="./images/icon_arrow@2x.png" alt="">' +
          //     '<span>开往' + num[index].endstation + '</span>' +
          //     '</div>';
          //   tag += '</li>';
          //   $(".dim_all").append(tag);
          //   })
          // }
        }
        // 地点数据.....盲点搜索不做
        // if (obj) {
        //   $.each(obj, function (i, e) {
        //     var tag = '<li class="obj_sta" bus_strlongitude=' + e.lon + ' bus_strlatitude=' + e.lat + '>' + e.name + '</li>';
        //     $(".info_ches>.yes_line").append(tag);
        //   });
        // }
        // 当回退或INPUT为空时清空--显隐
        if ($("#search").val() == "") {
          $(".info_ches").html("");
          $(".info_ches").removeClass("show").addClass("hide");
          $(".show_hide").removeClass("hide").addClass("show");
          $("#info_yes").show();
        } else {
          $(".info_ches").addClass("show");
          $("#show_hide").addClass("show");
          $("#info_yes").hide();
        }

        // 当数据过多设置高度滑动
        var window = (document.body.scrollWidth) - 60;
        if ($(".info_ches").height() > window) {
          $(".info_ches").css({ height: "100%" });
        }

        //模糊数据直接点击查询
        $(".info_ches").find('li').click(function () {
          var city_code_key = 'city_' + code;
          //线路查询接口
          if (this.className == "num_line") {
            // 带参跳转
            var routeid = $(this).attr('routeid');
            var direction = $(this).attr('direction');
            var routename = $(this).attr('routename');
            var endstation = $(this).attr('endstation');
            // H5缓存线路查询接口追加为历史记
            var A = localStorage.getItem("last_line");
            ste_line = {};
            var a_list = [];
            if (A) {
              ste_line = JSON.parse(A);
              if (ste_line[city_code_key]) {
                a_list = ste_line[city_code_key];
              }
            };
            var routline_loceid = {
              routeid: routeid,
              direction: direction,
              routename: routename,
              endstation: endstation
            };
            a_list.unshift(routline_loceid);
            ste_line[city_code_key] = a_list;
            // ste_line.unshift(routline_loceid);
            localStorage.setItem("last_line", JSON.stringify(ste_line));

            location.href = "./line/line_page.html?routename=" + routename + "&citycode=" + code + "&lng=" + lng + "&lat=" + lat + "&direction=" + direction + "&routeid=" + routeid;
          };

          //站点查询接口
          if (this.className == "dim_sta_li") {
            var bus_strlongitude = $(this).attr('bus_strlongitude');
            var bus_strlatitude = $(this).attr('bus_strlatitude');
            var routename = $(this).attr('routename');
            var stationid = $(this).attr('stationid');
            // H5缓存地点查询接口追加为历史记录
            var B_station = localStorage.getItem("last_ata");
            set_ata = {};
            var b_list = [];
            if (B_station) {
              set_ata = JSON.parse(B_station);
              if (set_ata[city_code_key]) {
                b_list = set_ata[city_code_key];
              }
            };
            var routsts_loceid = {
              bus_strlongitude: bus_strlongitude,
              bus_strlatitude: bus_strlatitude,
              routename: routename,
              stationid: stationid
            };
            b_list.unshift(routsts_loceid);
            // set_ata.unshift(routsts_loceid);
            set_ata[city_code_key] = b_list;
            localStorage.setItem("last_ata", JSON.stringify(set_ata));

            // 跳转
            location.href = "./stastion/station.html?stationid=" + stationid + "&routename=" + routename + "&citycode=" + code + "&lat=" + lat + "&lng=" + lng + "&StationName=" + StationName + "&bus_strlongitude=" + bus_strlongitude + "&bus_strlatitude=" + bus_strlatitude;
            // citycode: '610300', startlongitude: '107.17060', startlatitude: '34.346316', endlongitude: '107.131143', endlatitude: '34.359624' 
          }
        });
      }
    })
  });// 输入框模糊查询
});// JQM方法


// -------------------弹窗-----------------
// function sloder_tc() {
//   var w, h, className;
//   function getSrceenWH() {
//     w = $(window).width();
//     h = $(window).height();
//     $('#dialogBg').width(w).height(h);
//   }
//   window.onresize = function () {
//     getSrceenWH();
//   }
//   $(window).resize();

//   $(function () {
//     getSrceenWH();
//     $('#dialogBg').fadeIn(300);
//     $('#dialog').removeAttr('class').addClass('animated ' + className + '').fadeIn();
//     $('.claseDialogBtn').click(function () {
//       $('#dialogBg').fadeOut(300, function () {
//         $('#dialog').addClass('bounceOutUp').fadeOut();
//       });
//     });
//   });
// };
// -------------------------------------------请求后台接口获取相关信息
function lng_lat() {
  console.log("定位编码" + code);

  // 页面进入加载即查询请求接口带城市信息换区线路详情
  $.ajax({
    // url: URL_all + "/queryRouteStation/nearestStation?citycode=610300&longitude=107.112823&latitude=34.376564",
    url: URL_all + "/queryRouteStation/nearestStation?",
    data: { longitude: lng, latitude: lat, citycode: code },
    // data: { longitude: 114.475439, latitude: 36.601435, citycode: 130400 },    
    type: 'GET',
    dataType: 'JSON',
    async: false,
    success: function (res) {
      console.log(res);
      if (res.obj.currentStation.name !== null || res.obj.currentStation.stationid !== null) {//判断请求成功但没数据
        // 获取最近当前点
        StationName = res.obj.currentStation.name;
        var mmm = res.obj.currentStation.distance;
        // 设置页面
        $(".s_name").text(StationName);
        $(".s_mill").text(mmm + "m");
        $(".fuji").text("附近");

        //线路
        var oblines = res.obj.currentStationLines;
        var tag = '<ul>';
        $.each(oblines, function (i, v) {
          var routename = v.routeInBaseLine.routename;
          var endstation = v.routeInBaseLine.endstation;
          if (v.realTime.desc.stationnumber) {
            var stationnumber = v.realTime.desc.stationnumber;
            var stats = "站";
          } else {
            var stationnumber = "等待发车";
            var stats = "";
          };
          // if (v.realTime.desc.time) {
          var ttim = v.realTime.desc.time;
          // } else {
          //   var ttim = 0
          // }
          if (i < 3) {
            tag += '<li routeid=' + v.routeInBaseLine.routeid + ' direction=' + v.routeInBaseLine.direction + ' citycode=' + code + ' lat=' + lat + ' lng=' + lng + ' routename=' + routename + '>' +
              '<div class="up">' +
              '<span>' + routename + '</span>' +
              '<span>' + stats + '</span>' +
              '<span>' + stationnumber + '</span>' +
              '</div>' +
              '<div class="down">' +
              '<img src="./images/icon_arrow@2x.png" alt="">' +
              '<span>开往' + endstation + '</span>' +
              '<span>' + parseInt((ttim / 60)) + '分</span>' +
              '</div>' +
              '</li>';
          }
        });
        tag += '</ul>';
        $(".push_line").html(tag);

        //点击li_line线路跳转
        $(".push_line").on('click', 'li', function () {
          var routename = $(this).attr('routename');
          var direction = $(this).attr('direction');
          var routeid = $(this).attr('routeid');
          // 全局个人经纬度
          console.log(lat);
          console.log(lng);
          location.href = "./line/line_page.html?routename=" + routename + "&citycode=" + code + "&lng=" + lng + "&lat=" + lat + "&direction=" + direction + "&routeid=" + routeid;
        });

        //站点
        var obstations = res.obj.nearbyStations;
        var tag = '<ul>';
        $.each(obstations, function (i, v) {
          var bus_strlongitude = v.longitude;
          var bus_strlatitude = v.latitude;
          var routename = v.name;
          var stationid = v.stationid;
          console.log(v);
          if (i < 5) {
            tag += '<li stationid=' + stationid + ' citycode=' + code + ' bus_strlongitude=' + bus_strlongitude + ' bus_strlatitude=' + bus_strlatitude + ' routename=' + routename + '>' +
              '<span>' + v.name + '</span>' +
              '<span>' + v.distance + 'm</span>' +
              '<span>附近</span>' +
              '</li>';
          }
        });
        tag += '</ul>';
        $(".station_li").html(tag);

        //点击站点跳转
        $(".station_li").on('click', 'li', function () {
          var bus_strlongitude = $(this).attr('bus_strlongitude');
          var bus_strlatitude = $(this).attr('bus_strlatitude');
          var routename = $(this).attr('routename');
          var stationid = $(this).attr('stationid');
          location.href = "./stastion/station.html?stationid=" + stationid + "&routename=" + routename + "&citycode=" + code + "&lat=" + lat + "&lng=" + lng + "&StationName=" + StationName + "&bus_strlongitude=" + bus_strlongitude + "&bus_strlatitude=" + bus_strlatitude;
        });
      } else {
        $(".s_name").text("暂无查询数据");
      }
    },
    error: function (res) {
      console.log("获取首页信息失败")
    }
  })
};

// 数据重复过滤
function obj2key(obj, keys) {
  var n = keys.length,
    key = [];
  while (n--) {
    key.push(obj[keys[n]]);
  }
  return key.join('|');
}
//去重操作  
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
};