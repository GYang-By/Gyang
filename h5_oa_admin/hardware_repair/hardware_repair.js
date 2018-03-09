// 硬件返修3 hardware_repair
$(function () { //加载完毕执行
    $(".hardware_repair_float").click(function () {// 点击追加tab
        tab_add();
    });
    $(".tab_submit").click(function () {
        var 
        var dataArray = new Array();// table表格数据集
        var table_list = [];//单条数据集
        var Express_name = $("select option:selected")[0].value;//快递公司
        var ExpressNumber = $("#inp_text").val();//快递单号
        for (var i = 1; i < $("table tr").length; i++) {
            var Trade_name_list = $("table tr")[i].children[0].innerText;
            var amount_list = $("table tr")[i].children[1].innerText;
            var error_description_list = $("table tr")[i].children[2].innerText;
            if (Trade_name_list == "" && amount_list == "" && error_description_list == "") {
                continue;
            }

            let table_list_obj = {
                Trade_name_list: Trade_name_list,
                amount_list: amount_list,
                error_description_list: error_description_list,
            };

            table_list.push(JSON.stringify(table_list_obj));


        }
        debugger

    })



    // 点击追加tab
    function tab_add() {
        var tr_td = '<tr>'
            + '<td contentEditable="true"></td>'
            + '<td contentEditable="true"></td>'
            + '<td contentEditable="true"></td>'
            + '</tr>';
        $(".table_add").append(tr_td);
    }

})