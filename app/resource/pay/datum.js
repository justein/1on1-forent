/**
 * Created by longer on 2019/1/2.
 */
//展示云盘链接
function showCloud(url, orderNo, uuid) {
    arr = url.split("-");
    var extracted_url = arr[0];
    var extracted_code = arr[1];
    $('#extract_url').val(extracted_url);
    $('#extract_code').val(extracted_code);
    $('#extract_url_style').attr('href', extracted_url);
    $('#extract').modal('show');
    var pay_status = 3;
    update_status(orderNo, uuid, pay_status);
}

//添加下载量
function addDownload(product_id){
    var id = parseInt(product_id);
    $.ajax({
        url: "/app/Datum/addDatumDownload",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: true,//是否异步  默认为异步
        data: {id: id},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执
        },
        error: function () {
        }
    });
}

//发送资料信息
function sendDatumInform(info, uuid) {
    $.ajax({
        url: "/app/Inform/sendDatumInform",//当前ajax请求的地址
        type: 'post',//请求的方式
        async: true,//是否异步  默认为异步
        data: {uuid: uuid, info: info},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执
        },
        error: function () {
            console.log('发送下载资料通知失败');
        }
    });
}