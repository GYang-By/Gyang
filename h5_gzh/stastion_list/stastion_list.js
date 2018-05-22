$(function () { //加载完毕执行
    var set_ata;//h5缓存
    //获取上个页面带过来的值
    var bus_strlongitude = getURLParameter("bus_strlongitude");
    var bus_strlatitude = getURLParameter("bus_strlatitude");
    var routename = getURLParameter("routename");
    var routeid = getURLParameter("routeid");
    var lat = getURLParameter("lat");
    var lng = getURLParameter("lng");
    var citycode = getURLParameter("citycode");
    // 自定义的js函数，根据参数名取参数值
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    };

    //获取缓存渲染----------站点
    var last_sta_get = [];
    var eval_slice = eval(localStorage.getItem("last_ata_list"));
    if (eval_slice == null) {
        eval_slice = [];
    } else {
        eval_slice = uniqeByKeys(eval_slice, ['stationid']);
    };
    if (eval_slice.length > 20) {
        last_sta_get = eval_slice.slice(0, 20);
    } else {
        last_sta_get = eval_slice
    }
    if (last_sta_get) {
        $("#info_yes").show();
        var tag = '<ul class="info_yes_his">';
        $.each(last_sta_get, function (index, vl) {
            tag += '<li class="dim_sta_li" bus_endlongitude=' + last_sta_get[index].bus_endlongitude + ' bus_endlatitude=' + last_sta_get[index].bus_endlatitude + ' routename=' + last_sta_get[index].routename + ' >' +
                '<img src="../images/icon_bus_plate@2x.png" alt="">' +
                '<span>' + last_sta_get[index].end_name + '</span>' +
                '</li>';
        });
        tag += '</ul>'
        $("#info_yes").html(tag);

        // 点击追加历史记录站台跳转
        $(".info_yes_his").find('li').click(function () {
            var bus_endlongitude = $(this).attr('bus_endlongitude');
            var bus_endlatitude = $(this).attr('bus_endlatitude');
            var end_name = this.innerText;
            // var routename = $(this).attr('routename');
            location.href = "../stastion_list_end/stastion_list_end.html?bus_strlongitude=" + bus_strlongitude + "&routename=" + routename + "&bus_strlatitude=" + bus_strlatitude + "&citycode=" + citycode + "&lat=" + lat + "&lng=" + lng + "&end_name=" + end_name + "&bus_endlongitude=" + bus_endlongitude + "&bus_endlatitude=" + bus_endlatitude;
            // citycode: '610300', startlongitude: '107.17060', startlatitude: '34.346316', endlongitude: '107.131143', endlatitude: '34.359624' 
        });
    };//if

    // 点击清空
    $(".both_has").on("tap", function () {
        $("#info_yes").remove();
        localStorage.removeItem("last_ata_list");
    });

    // d点击取消回到首页
    $("#container .a").click(function () {
        event.preventDefault();
        location.href = "../webh5.html"
    });

    //X伪元素---与首页input事件元素一样，后续如有input事件可能会冲突
    $(".ui-field-contain").on("click", ".ui-input-clear", function () {
        if ($("#search").val() == "") {
            $(".yes_station_list").html("");
            $(".yes_station_list").hide();
            // 为空历史记录显示
            $(".span_list").show();
            $("#info_yes").show();
        } else {
            $(".yes_station_list").show();
            //搜索历史记录隐藏                   
            $(".span_list").hide();
            $("#info_yes").hide();
        }
    });

    // 点击输入框模糊查询公交站
    $("#search").bind('input propertychange', function () {
        var kw = $(this).val();
        console.log(kw);
        if (kw == "") {
            return false;
        };
        $.ajax({
            url: URL_all + "/queryRouteStation/routeAndStation",
            data: { name: kw, citycode: citycode },
            type: "GET",
            async: false,
            dataType: "JSON",
            success: function (data) {
                console.log(data);
                var tag = '<ul class="yes_line">';
                $.each(data.obj.stations, function (i, e) {
                    tag += '<li class="dim_sta_li" stationid=' + e.stationid + ' citycode=' + citycode + ' startlongitude=' + bus_strlongitude + ' startlatitud=' + bus_strlatitude + ' name=' + e.name + ' bus_endlatitude=' + e.latitude + ' bus_endlongitude=' + e.longitude + '>' +
                        '<img src="../images/icon_bus_plate@2x.png">' +
                        '<span>' + e.name + '</span>' +
                        '</li>';
                });
                tag += '</ul>';
                $(".yes_station_list").html("");
                $(".yes_station_list").html(tag);

                // 模糊数据--点击查询点击跳转-----点击及时模糊查询跳转同时历史记录
                $(".yes_station_list").on('click', 'li', function () {
                    $(this).css('backgroundColor', '#ccc');
                    // 模糊数据地点查询点击接口跳转
                    var bus_endlongitude = $(this).attr('bus_endlongitude');
                    var bus_endlatitude = $(this).attr('bus_endlatitude');
                    var stationid = $(this).attr('stationid');
                    var end_name = $(this).attr('name');
                    // H5缓存详细站点查询接口追加为历史记录--------------------
                    // 换存判断20条、已存在---------
                    var hist = localStorage.getItem("last_ata_list");
                    set_ata = [];
                    if (hist) {
                        set_ata = JSON.parse(hist);
                    }

                    var routsts_loceid = {
                        bus_endlongitude: bus_endlongitude,
                        bus_endlatitude: bus_endlatitude,
                        stationid: stationid,
                        end_name: end_name
                    };
                    set_ata.unshift(routsts_loceid);
                    localStorage.setItem("last_ata_list", JSON.stringify(set_ata));

                    location.href = "../stastion_list_end/stastion_list_end.html?bus_strlongitude=" + bus_strlongitude + "&routename=" + routename + "&citycode=" + citycode + "&lat=" + lat + "&lng=" + lng + "&bus_strlatitude=" + bus_strlatitude + "&end_name=" + end_name + "&bus_endlongitude=" + bus_endlongitude + "&bus_endlatitude=" + bus_endlatitude;
                });
                // 当回退或INPUT为空时清空
                if ($("#search").val() == "") {
                    $(".yes_station_list").html("");
                    $(".yes_station_list").hide();
                    // 为空历史记录显示
                    $(".span_list").show();
                    $("#info_yes").show();
                } else {
                    $(".yes_station_list").show();
                    //搜索历史记录隐藏                   
                    $(".span_list").hide();
                    $("#info_yes").hide();
                }

                // 当数据过多设置高度滑动
                var window = (document.body.scrollWidth) - 100;
                if ($(".yes_station_list").height() > window) {
                    $(".yes_station_list").css({ height: "85%" });
                }
            }
        })
    });// 输入框模糊查询
});

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
}  