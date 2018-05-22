$(document).ready(function () {
    $('._back').on('click', function () {
        window.history.go(-1);
    });

    // d点击取消回到首页
    $(".home_back").on('click', function (event) {
        event.preventDefault();
        location.href = "../webh5.html";
    });

    //获取上个页面带过来的值
    var bus_strlongitude = getURLParameter("bus_strlongitude");
    var bus_strlatitude = getURLParameter("bus_strlatitude");
    var bus_endlongitude = getURLParameter("bus_endlongitude");
    var bus_endlatitude = getURLParameter("bus_endlatitude");
    var s_routename = getURLParameter("routename");
    var routeid = getURLParameter("routeid");
    var end_name = getURLParameter("end_name");
    var citycode = getURLParameter("citycode");
    var lat = getURLParameter("lat");
    var lng = getURLParameter("lng");
    $(".stastion_bus").html(end_name + '公交站');
    // 自定义的js函数，根据参数名取参数值
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    };

    $.ajax({
        url: URL_all + "/queryRouteStation/findAllRoutesByStartAndDistinctPlace?",
        //http://192.168.2.134:8080/queryRouteStation/findAllRoutesByStartAndDistinctPlace?citycode=610300&startlongitude=107.247194&startlatitude=34.3475&endlongitude=107.253167&endlatitude=34.347444
        data: { citycode: citycode, startlongitude: bus_strlongitude, startlatitude: bus_strlatitude, endlongitude: bus_endlongitude, endlatitude: bus_endlatitude },
        type: "GET",
        dataType: "JSON",
        async: false,
        success: function (data) {
            var all_r = data.obj.generalRoutes;
            if (all_r == undefined || all_r.length == 0) {
                Popup.toast("暂无站点查询数据", 2000);
            };
            var tag = '<ul>';
            $.each(all_r, function (i, v) {
                var routename = v.baseRoute.routename;
                var endstation = v.baseRoute.endstation;
                if (v.nearestBus.desc.stationnumber) {
                    var stationnumber = v.nearestBus.desc.stationnumber;
                    var stats = "站";
                } else {
                    var stationnumber = "等待发车";
                    var stats = "";
                }
                var time = v.nearestBus.desc.time;
                tag += '<li citycode=610300 startlongitude=107.17060 startlatitude=34.346316 routename=' + routename + ' routeid=' + v.baseRoute.routeid + ' direction=' + v.baseRoute.direction + '>' +
                    '<div class="U">' +
                    '<img src="../images/icon_bus@2x.png" alt="">' +
                    '<span class="life_line">' + routename + '</span>' +
                    '<span>距</span>' +
                    '<span class="on_Station">' + s_routename + '公交站</span>' +
                    '<span>' + stats + '</span>' +
                    '<span class="bigenStation">' + stationnumber + '</span>' +
                    '</div>' +
                    '<div class="D">' +
                    '<img src="../images/icon_arrow@2x.png" alt="">' +
                    '<span>开往</span>' +
                    '<span class="endbus">' + endstation + '</span>' +
                    '<span class="endtime">' + parseInt((time / 60)) + '分</span>' +
                    '</div>' +
                    '</li>';
            })
            tag += '</ul>';
            $(".tation_ul").html(tag);

            // 点击线路跳转至line线路详情
            $(".tation_ul").on('click', 'li', function () {
                var routename = $(this).attr('routename');
                var direction = $(this).attr('direction');
                var routeid = $(this).attr('routeid');
                // 全局个人经纬度
                // console.log(lat);
                // console.log(lng);
                location.href = "../line/line_page.html?lng=" + lng + "&lat=" + lat + "&citycode=" + citycode + "&routename=" + routename + "&direction=" + direction + "&routeid=" + routeid;
            });
        }//success
    });
})