
$(document).ready(function () {
    var timer;
    //获取上个页面带过来的值
    var routeid = getURLParameter("routeid");
    var direction = getURLParameter("direction");
    var routename = getURLParameter("routename");
    var citycode = getURLParameter("citycode");
    var lat = getURLParameter("lat");
    var lng = getURLParameter("lng");
    var reverse_status = 0;
    var reversal;//判断当前线路是否换向0可以，1不可以

    // 取缓存
    var stationid_id = sessionStorage.getItem("stationid_loca");
    var stationid_stationno = sessionStorage.getItem("stationid_stationno");

    // 自定义的js函数，根据参数名取参数值
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    };

    // 设置title
    $(".title_line>span").html(routename)

    // 下部分滑动接口进入页面渲染
    // down_slider(direction);
    if (stationid_id && stationid_stationno) {
        down_slider(direction, stationid_id, stationid_stationno);
    } else {
        down_slider(direction, "", "");
    };
    
    // 滑动
    var bus_iscroll;
    $(function () {
        bus_iscroll = new iScroll("wrapper", {
            // snap: true,
            momentum: true,
            vScroll: false,
            hScroll: true,
            hScrollbar: false,
        });
        // 加载
        $(window).load(function (e) {
            console.log(e)
            liresize();
        });
        // 窗口改变
        $(window).resize(function (e) {
            liresize();
        });
    });
    function liresize() {
        var w = $(".wrapper").width();
        // 设置li标签的视口宽度
        // $(".bull").width(w);
        if (bus_iscroll) {
            bus_iscroll.refresh();
        }
    };

    // 点击返回回到上一级
    $('._back').on('click', function () {
        window.history.go(-1);
    });

    //点击逆向事件
    $(".line_change").on('click', function () {
        // soort();
        // if (reverse_status) {
        //     reverse_status = 0;
        // } else {
        //     reverse_status = 1;
        // };
        // liresize();

        if (reversal == 0) {
            sessionStorage.removeItem("stationid_loca");
            sessionStorage.removeItem("stationid_stationno");
            direction == 0 ? direction = 1 : direction = 0;
            // 换向覆盖掉全局
            stationid_id = sessionStorage.getItem("stationid_loca");
            stationid_stationno = sessionStorage.getItem("stationid_stationno");
            down_slider(direction, "", "");
            // 清除定时器并重启
            clearInterval(timer);
            timer = setInterval(function () {
                if (stationid_id && stationid_stationno) {
                    down_slider(direction, stationid_id, stationid_stationno);
                } else {
                    down_slider(direction, "", "");
                };
            }, 15000);
        } else {
            Popup.toast("此线路暂无换向换行数据", 1800);
        }
    });

    // 点击底部刷新事件
    $(".line_ag").on('click', function () {
        // down_slider(direction, stationid_id, stationid_stationno);

        if (stationid_id && stationid_stationno) {
            down_slider(direction, stationid_id, stationid_stationno);
        } else {
            down_slider(direction, "", "");
        };

        Popup.showLoading('');
        window.setTimeout('$(".ui-mask").remove()', 3000);
        window.setTimeout('$(".ui-dialog").remove()', 3000);
    });

    loading_ing();

    // 定时器默认刷新
    // timer = setInterval(function () {
    //     if (stationid_id && stationid_stationno) {
    //         down_slider(direction, stationid_id, stationid_stationno);
    //     } else {
    //         down_slider(direction, "", "");
    //     };
    // }, 15000);

    // slider滑动站点数据+title数据 进口数据
    function down_slider(direction, stationid_id, stationid_stationno) {
        $.ajax({
            url: URL_all + "/travel/routeDetail?",
            data: { latitude: lat, citycode: citycode, longitude: lng, routeid: routeid, direction: direction },
            // citycode	城市编码direction上下行latitude纬度longitude	经度routeid线路id
            type: "GET",
            dataType: "JSON",
            async: false,
            success: function (data) {
                if (data.obj.station == 0) {
                    $("body").html("");
                    Popup.toast("暂无查询数据", 1800);
                    window.setTimeout("window.history.go(-1)", 1800)
                };
                console.log(data);
                // 当前位置站台沾序+站点
                var stationno = data.obj.currentStation.stationno;
                var stationid = data.obj.currentStation.stationid;
                // 顶部信息渲染
                var price = data.obj.route.price;
                var startstation = data.obj.route.startstation;
                var endstation = data.obj.route.endstation;
                reversal = data.obj.route.reversal;
                var starttime = data.obj.route.starttime;
                var endtime = data.obj.route.endtime;
                $(".top .start").html(startstation);
                $(".top .end").html(endstation);
                $(".bottom .time").html(starttime + '-' + endtime);
                $(".bottom .money").html(price + '元');
                // 
                var obj_slider = data.obj.station;
                // if (reverse_status) {//换向事件判断
                // obj_slider.reverse();
                // };
                var direction = data.obj.route.direction;
                var tag = '';
                $("#title_ul").html('');
                $.each(obj_slider, function (i, v) {
                    var stationid = v.stationid;
                    var li_five_str = '<span class="li_five">' + (i + 1) + '</span>';
                    // if (reverse_status) {
                    //     li_five_str = '<span class="li_five">' + (obj_slider.length - i) + '</span>';
                    // };
                    tag += '<li class="title_li" ol_index="' + i + '" station_id="' + stationid + '" stationno="' + v.stationno + '">' +
                        '<span class="li_o">空调</span>' +
                        '<img class="li_two" src="../images/icon_bus_h@2x.png">' +
                        '<i class="li_t"></i>' +
                        '<div class="li_f"></div>' +
                        li_five_str +
                        '<span class="li_six">' + v.name + '</span>' +
                        '</li>';
                });
                $("#title_ul").html(tag);

                // 换向重新加载渲染iscroll
                liresize();

                // 数据渲染完成调用方法显示当前人的所在站点---------------------------
                if (stationid_id) {
                    out_down(stationid_id, "", "");
                } else {
                    out_down(stationid, "", "");
                };
                // 上部分渲染接口----根据slider数据而来，包括小汽车部分---------------
                if (stationid_id && stationid_stationno) {
                    station_car_info(routeid, stationid_id, direction, stationid_stationno, citycode)
                } else {
                    station_car_info(routeid, stationid, direction, stationno, citycode)
                }
            }
        });
    };

    // 上部分模块数据
    function station_car_info(routeid, stationid, direction, stationno, citycode) {
        $.ajax({
            url: URL_all + "/travel/realTime?",
            data: { routeid: routeid, stationid: stationid, direction: direction, userstationno: stationno, citycode: citycode },
            type: "GET",
            dataType: "JSON",
            success: function (data) {
                console.log(data)
                if (data.obj.length == 0) {
                    $(".center").html('暂无相关数据');
                } else {
                    $(".center").html('')
                    var i_index = 0;
                    $.each(data.obj, function (i, v) {
                        var bus_data = v;
                        // 千米转化
                        var distance = v.desc.distance;
                        distance > 1000 ? distance = parseInt(distance / 1000) + 'km' : distance = parseInt(distance) + 'm';
                        if (v.desc.stationnumber >= 0) {//为负过滤
                            if (i_index < 3) {
                                if (v.desc.stationnumber == 0) {
                                    var a = document.createElement('div');
                                    a.setAttribute("class", "demo_ele this_down");
                                    a.innerHTML = "已到站";
                                    $(".center").append(a);
                                    i_index += 1;
                                } else {
                                    var tag = '<div class="demo_ele">';
                                    tag += '<div class="demo_ele_station">' + v.desc.stationnumber + '站</div>' +
                                        '<div>' +
                                        '<span class="demo_ele_time">' + parseInt((v.desc.time) / 60) + '分</span>' +
                                        '<span class="demo_ele_distance">' + distance + '</span>' +
                                        '</div>' +
                                        '<div class="demo_ele_ming">' + v.bus.busplatenumber + '</div>';
                                    tag += '</div>';
                                    $(".center").append(tag);
                                    i_index += 1;
                                }
                            }
                        };
                        out_down(stationid, bus_data, "");
                    });
                    if ($(".center").html() == "") {
                        $(".center").html('等待发车').addClass("none_num");
                    } else {
                        $(".center").removeClass("none_num");
                    };
                    if ($(".demo_ele").html() == "已到站") {
                        $(".this_down").addClass("none_num");
                    }
                    // $(".center").css({ "font-size": "18px", "line-height": "2.4rem", "color": "#2ab650" })
                }
            }
        });
    }
    // 表关联
    // function get_new_station(dataObj){
    //     var new_station = [],
    //         station = dataObj.station,
    //         carList = dataObj.carList;

    //     for (var i=0, il=station.length; i<il; i++){
    //         var n_station = station[i];
    //         for (var j=0, jl=carList.length; j<jl; j++){
    //             var carObj = carList[j];
    //             var bus = carObj.bus;
    //             var desc = carObj.desc;
    //             if (n_station.stationid == desc.stationid){
    //                 n_station.bus = bus;
    //                 n_station.desc = desc;
    //                 break;
    //             }
    //         }
    //         new_station.push(n_station);
    //     }
    //     return new_station;
    // }

    // 12.10滑动事件点击
    function loading_ing() {
        var i;
        var li = document.getElementsByTagName('li');
        var z_index;
        $('ul').on('click', '.title_li', function () {
            var _this = $(this);
            var z_index = $(this).index() + 1
            var stationid = $(_this).attr('station_id');
            var stationno = $(_this).attr('stationno');
            // 缓存点击点
            // localStorage.setItem("stationid_loca", stationid);
            // localStorage.setItem("stationid_stationno", stationno);

            sessionStorage.setItem("stationid_loca", stationid);
            sessionStorage.setItem("stationid_stationno", stationno);

            // -----------------------------------------------
            // stationid_id = localStorage.getItem("stationid_loca");
            // stationid_stationno = localStorage.getItem("stationid_stationno");

            stationid_id = sessionStorage.getItem("stationid_loca");
            stationid_stationno = sessionStorage.getItem("stationid_stationno");

            if (stationid_id && stationid_stationno) {
                station_car_info(routeid, stationid_id, direction, stationid_stationno, citycode)
            } else {
                station_car_info(routeid, stationid, direction, stationno, citycode)
            };
            if (stationid_id) {
                out_down(stationid_id, "", 'click');
            } else {
                out_down(stationid, "", 'click');
            }
        })
    };
    // slider滑动样式表
    function out_down(stationid, bus_data, click) {

        // 当前位置高亮
        // 空调状态-li_o-display: block;
        //    var this_index=$("#title_ul li[station_id=" + stationid + "]").index();
        //    var this_class='';
        //     for(var i=0;i<$("#title_ul li").length;i++){
        //             if(i<this_index){
        //                 this_class='color_green'; 
        //             }else if(i==this_index){
        //                 this_class='color_red';
        //             }else{
        //                 this_class='color_red_green';
        //             }
        //             $("#title_ul li").eq(i).find(".li_f").removeClass('color_green color_red color_red_green').addClass(this_class);
        //     };
        // 第二次
        if (bus_data !== '') {
            console.log(bus_data.bus.bustype);
            console.log(bus_data.desc.stationid);
            $("#title_ul li[station_id=" + bus_data.desc.stationid + "]").find(".li_two").css({ visibility: "inherit" });
            $("#title_ul li[station_id=" + bus_data.desc.stationid + "]").find(".li_two").attr("src", "../images/ico@2x.png");
            // 处理右边汽车
            $("#title_ul li[station_id=" + stationid + "]").find(".li_two").attr("src", "../images/ico@2x.png").end().nextAll("li").children(".li_two").attr("src", "../images/icon_bus_h@2x.png");

            if (bus_data.bus.bustype !== 1) {
                $("#title_ul li[station_id=" + bus_data.desc.stationid + "]").find(".li_o").css({ visibility: "inherit" });
                // 为到站站点的数字和站名高亮
                // $("#title_ul li[station_id=" + bus_data.desc.stationid + "]").find(".li_five").css({ color: "#2AB650" });
                // $("#title_ul li[station_id=" + bus_data.desc.stationid + "]").find(".li_six").css({ color: "#2AB650" });
            }
        } else {
            if (click == '') {
                $("#title_ul li[station_id=" + stationid + "]").find(".li_two").attr("src", "../images/ico@2x.png").end().prevAll().children(".li_two").attr("src", "../images/icon_bus_h@2x.png");
                $("#title_ul li[station_id=" + stationid + "]").find(".li_two").attr("src", "../images/ico@2x.png").end().nextAll("li").children(".li_two").attr("src", "../images/icon_bus_h@2x.png");
            };
            $("#title_ul li[station_id=" + stationid + "]").find(".li_f").css({ transform: 'scale(2)', backgroundColor: '#FA4535' }).end().siblings("li").children(".li_f").css({ transform: 'scale(1)', backgroundColor: '#fff' });

            // ---------偏移量
            var num = $("#title_ul").find('li').length;
            var thisW = $("#title_ul li[station_id=" + stationid + "]");
            var i = $("#title_ul li[station_id=" + stationid + "]").index() + 1;
            var offsetW;
            console.log(thisW)
            setTimeout(function () {
                if ((num - i) < 4) {
                    offsetW = -($("#title_ul").find('li').eq((num - 8))[0].offsetLeft);
                } else if (i < 4) {
                    offsetW = 0;
                } else {
                    offsetW = -($("#title_ul").find('li').eq((i - 4))[0].offsetLeft);
                }
                console.log(offsetW)
                $('#title_ul').css('transform', 'translate(' + offsetW + 'px,0px)')
            }, 15);
            //--------------- 
            $("#title_ul li[station_id=" + stationid + "]").find(".li_five").css({ color: "#2AB650" }).end().siblings("li").children(".li_five").css({ color: "#333" });

            $("#title_ul li[station_id=" + stationid + "]").find(".li_six").css({ color: "#2AB650" }).end().siblings("li").children(".li_six").css({ color: "#333" });

            $("#title_ul li[station_id=" + stationid + "]").find(".li_t").css({ backgroundColor: "#2AB650" }).end().prevAll().children(".li_t").css({ backgroundColor: "#2AB650" });
            $("#title_ul li[station_id=" + stationid + "]").find(".li_t").css({ backgroundColor: "#2AB650" }).end().nextAll("li").children(".li_t").css({ backgroundColor: "#bb8b8b" });
        }
    }

    // 倒叙
    // function soort() {
    //     var dom_list = $("#title_ul .title_li");
    //     var soot = $(dom_list).toArray().reverse();
    //     $("#title_ul").html("");
    //     $("#title_ul").append($(soot));//转对象
    // }
})//ready
