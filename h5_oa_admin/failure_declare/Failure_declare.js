// 故障申报1 Failure_declare\
$(function () { //加载完毕执行
    $(".click_sub").click(function () {
        var type_id =$("select option:selected")[0].value;
        var textarea_tex = $("textarea").val()
        console.log(type_id);
        console.log(textarea_tex);
    })






})