$(document).ready(function () {
    // 返回上级页面
    $("._back").click(function () {
        window.history.go(-1);
    })

    $(".title_line a").click(function () {
        event.preventDefault();
        window.location = "../webh5.html"
    })
    //获取上个页面带过来的值
    var bus_strlongitude = getURLParameter("bus_strlongitude");
    var bus_strlatitude = getURLParameter("bus_strlatitude");
    var routename = getURLParameter("routename");
    var StationName = getURLParameter("StationName");
    var citycode = getURLParameter("citycode");
    var lat = getURLParameter("lat");
    var lng = getURLParameter("lng");
    var stationid = getURLParameter("stationid");
    $(".stastion_bus").html(routename + '公交站');
    // 自定义的js函数，根据参数名取参数值
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    };

    // 从模糊查询/站点信息站点过来，然后在此页面加载请求相关接口渲染页面
    $.ajax({
        url: URL_all + "/queryRouteStation/route?",
        data: { citycode: citycode, stationid: stationid },
        type: "GET",
        dataType: "JSON",
        async: false,
        success: function (data) {
            var all_r = data.obj;
            var tag = '<ul>';
            $.each(all_r, function (i, v) {
                var routename_line = v.routeInBaseLine.routename;
                var endstation = v.routeInBaseLine.endstation;
                if (v.realTime.desc.stationnumber) {
                    var stationnumber = v.realTime.desc.stationnumber;
                    var stats = "站";
                } else {
                    var stationnumber = "等待发车";
                    var stats = "";
                };
                var time = v.realTime.desc.time;
                tag += '<li citycode=' + citycode + ' &startlongitude=' + lng + ' startlatitude=' + lat + ' routename_line=' + routename_line + ' routeid=' + v.routeInBaseLine.routeid + ' direction=' + v.routeInBaseLine.direction + '>' +
                    '<div class="U">' +
                    '<img src="../images/icon_bus@2x.png" alt="">' +
                    '<span class="life_line">' + routename_line + '</span>' +
                    '<span>距</span>' +
                    '<span class="on_Station">' + routename + '公交站</span>' +
                    '<span class="null_ax">' + stats + '</span>' +
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
            // if ($(".bigenStation").html() == "null") {
            //     $(".null_ax").hide()
            // }
        }
    });

    // 点击线路跳转至line线路详情
    $(".tation_ul").on('click', 'li', function () {
        var routename_line = $(this).attr('routename_line');
        var direction = $(this).attr('direction');
        var routeid = $(this).attr('routeid');
        // 全局个人经纬度
        // console.log(lat);
        // console.log(lng);
        location.href = "../line/line_page.html?routename=" + routename_line + "&lat=" + lat + "&lng=" + lng + "&citycode=" + citycode + "&direction=" + direction + "&routeid=" + routeid;
    });

    // 点击input跳转至stastion_list
    $("#search").click(function () {
        var routeid = $(this).attr('routeid');
        location.href = "../stastion_list/stastion_list.htm?routename=" + routename + "&citycode=" + citycode + "&lat=" + lat + "&lng=" + lng + "&bus_strlatitude=" + bus_strlatitude + "&bus_strlongitude=" + bus_strlongitude + "&routeid=" + routeid;
    });
})