// 已认证项目主页面 verified_user曝露入口
$(document).ready(function () {
    $(".Failure_declare").on("click", function () {
        var _this_id = $(this).attr('list_id');
        switch (_this_id) {
            case '1'://故障申报
                window.location.href = "./failure_declare/failure_declare.html";
                break;
            case '2'://工单查询
                window.location.href = "./order_query/order_query.html";
                break;
            case '3'://硬件返修
                window.location.href = "./hardware_repair/hardware_repair.html";
                break;
            case '4'://返修查询
                window.location.href = "./repair_enquiry/repair_enquiry.html";
                break;
            case '5'://投诉与建议
                window.location.href = "./complaints_suggestions/complaints_suggestions.html";
                break;
            case '6'://处理进度
                window.location.href = "./processing_progress/processing_progress.html";
                break;
            case '7'://邀请同事
                window.location.href = "./inviting_colleague/inviting_colleague.html";
                break;
            case '8'://我的邀请
                // status = '已批准';
                // classType = 'green';
                // icon = 'perform-succ';
                window.location.href = "./my_invitation/my_invitation.html"
                break;
            default:
                break;
        }
    })
})