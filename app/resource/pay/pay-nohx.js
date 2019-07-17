/**
 * Created by longer on 2019/1/9.
 */

//下载资料
function down() {
    var product_id = $('#product_id').val(), type = 'datum', uuid = $('#uuid').val(), orderNo = '', file = $('#file').val(), url = '/app/Datum/downloadFile' + '?file=' + file + '&order_number='
        ,deliver_type = $('#deliver_type').val(), extracted_url = $('#extracted_url').val(), facilitator_uuid = $('#facilitator_uuid').val(), product_name = $('#product_name').val()
        ,balance = $('#balance').val(), price = $('#price').val(), member_price = $('#member_price').val(), grade = $('#grade').val(),preview = '';

    //登录状态
    if (uuid != '') {
        if (download_status == true) {
            if (deliver_type == 'file') {
                if ((grade == 'vip' && member_price == 0) || (grade == 'normal' && price == 0) ){
                    $("#success-message").text('正在下载中.......');
                    $('#success-hit').modal('show');
                }
                var index = 0, query_type = 'datum';
                payOrder(product_id, type, uuid, grade, price, member_price, balance, url, deliver_type, facilitator_uuid, product_name, index, query_type,preview)
            } else {
                if ((grade == 'vip' && member_price == 0) || (grade == 'normal' && price == 0) ){
                    $("#success-message").text('正在提取中.......');
                    $('#success-hit').modal('show');
                }
                var index = 0, query_type = 'datum';
                payOrder(product_id, type, uuid, grade, price, member_price, balance, extracted_url, deliver_type, facilitator_uuid, product_name, index, query_type, preview)
            }

        }
    } else {
        $('#login').modal('show');
    }
}

//支付订单
function payOrder(product_id, type, uuid, grade, price, member_price, balance, url, deliver_type, facilitator_uuid, product_name, index, query_type,preview) {
    if (uuid == '') {
        $('#login').modal('show');
    } else {
        orderNo = createOrderNum();
        if (orderNo != '') {
            var data =  createOrder(uuid, type, product_id, orderNo); //创建订单时要把当前的订单金额录入系统
            if (data.code == 1001 && data.data.pay_status == 2) { //创建订单成功且未支付
                if (grade == 'vip' && member_price == 0) {
                    var pay_type = 4;
                    if (query_type == 'datum') {
                        if (deliver_type == 'cloud') {
                            $("#success-message").text('正在提取中......');
                        }else{
                            $("#success-message").text('正在下载中......');
                        }
                    }else{
                        $("#success-message").text('正在查询中......');
                    }
                    $('#success-hit').modal('show');
                    free(orderNo, index, pay_type, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name,preview);
                } else if (grade == 'normal' && price == 0) {
                    var pay_type = 4;
                    if (query_type == 'datum') {
                        if (deliver_type == 'cloud') {
                            $("#success-message").text('正在提取中......');
                        }else{
                            $("#success-message").text('正在下载中......');
                        }
                    }else{
                        $("#success-message").text('正在查询中......');
                    }
                    $('#success-hit').modal('show');
                    free(orderNo, index, pay_type, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name,preview);
                } else if (parseFloat(balance) < parseFloat(price)) { //余额不足 还需要根据会员类型判断价格 balance < price && membership_grade = normal
                    $('#buy').modal('show');
                    //微信支付
                    $('#wechat').click(function () {
                        //微信快捷支付
                        weChart(orderNo, index, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name, preview);

                    });
                    //支付宝支付
                    $('#alipay').click(function () {
                        aliPay(orderNo, index, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name, preview);
                    });
                } else {
                    //余额充足
                    $('#enough_buy').modal('show');
                    var pay_type = 3;
                    $("#enough_buy_pay").click(function () {
                        is_has_balance = isHasBalance(uuid, price);
                        if(is_has_balance){
                            free(orderNo, index, pay_type, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name,preview);
                        }else{
                            $('#enough_buy').modal('hide');
                            $('#buy').modal('show');
                            //微信支付
                            $('#wechat').click(function () {
                                //微信快捷支付
                                weChart(orderNo, index, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name, preview);

                            });
                            //支付宝支付
                            $('#alipay').click(function () {
                                aliPay(orderNo, index, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name, preview);
                            });
                        }

                    });
                }
            } else if (data.data.pay_status == 1) {
                console.log('该订单已支付');
            } else {
                console.log('创建订单失败');
            }
        }else{
            console.log('生成订单号失败');
        }
    }
}

//获取订单详情
var uuid = $('#uuid').val(),id = $('#id').val(),balance = $('#balance').val(),price = $('#price').val(), member_price = $('#member_price').val(),grade = $('#grade').val(),
    download_status = true,order_status = '', close_time = null, n = 0, is_end = false, pay_message = ',支付金额已退回余额！';
function getOrderDetail(orderNo, pay_type,  index, type, query_type, uuid, url, deliver_type, product_id, facilitator_uuid, product_name,preview) {
    if (is_end == true){
        clearTimeout(close_time);
        is_end = false;
        return;
    }
    close_time = setTimeout(function () {
        pub_key = $('#public_key').val();
        var js_encrypt = new JSEncrypt();
        //初始化公钥
        js_encrypt.setPublicKey(pub_key);
        key1 = '{"uuid": "'+uuid+'", "order_number": ';
        key2 = '"'+orderNo+'","facilitator_uuid": "'+facilitator_uuid+'"}';
        key1 = js_encrypt.encrypt(key1);
        key2 = js_encrypt.encrypt(key2);

        $.ajax({
            url: "/app/Order/queryOrder",//当前ajax请求的地址
            type: 'get',//请求的方式
            async: false,//是否异步  默认为异步
            data: {key1:key1, key2: key2},//当前ajax请求的参数
            dataType: "json",
            success: function (data) {//发送成功时的代码执行
                order_status = data.data.pay_status;
                order_id = data.data.id;
                if (data.code == 1001 && order_status == 1) {
                    var real_pay=data.data.real_pay;
                    $('#buy').modal('hide');
                    if (query_type == 'datum') {
                        sendPayInform(real_pay, facilitator_uuid);
                        if (deliver_type == 'cloud') {
                            if (pay_type != 4) {
                                $("#success-message").text('支付成功,正在提取中.......');

                            } else {
                                $("#success-message").text('正在提取中.......');
                            }
                            $('#success-hit').modal('show');
                            setTimeout(function () {
                                $('#success-hit').modal('hide');
                            }, 3000);
                            setTimeout(function(){showCloud(url, orderNo, uuid);
                            }, 3000);
                            var pay_status = 3;
                            update_status(orderNo, uuid,pay_status);
                        } else {
                            var new_url = url + orderNo + '&uuid=' + uuid + '&pay_type=' + pay_type;
                            window.open(new_url, 'a_iframe');
                            download_status = false;
                            if (pay_type != 4) {
                                $("#success-message").text('支付成功,正在下载中.......');
                            }
                            $('#success-hit').modal('show');
                        }
                    }else{
                        if (pay_type != 4) {
                            $("#success-message").text('支付成功,正在查询中.......');
                        }
                        $('#success-hit').modal('show');
                        setTimeout(function () {
                            $('#success-hit').modal('hide');
                        },2000);
                        if (query_type == 'search_two') {
                            setTimeout(function(){
                                var data=queryReportSearch(index);
                                if(data.code == 1001){
                                    var pay_status = 3;
                                    update_status(orderNo, uuid, pay_status);
                                    aftersearch(data,preview,1);
                                }else{
                                    $('#success-hit').modal('hide');
                                    if (pay_type != 4) {
                                        $("#error-hits").text(data.message + pay_message);
                                    }else{
                                        $("#error-hits").text(data.message);
                                    }
                                    $('#error-download-hit').modal('show');
                                    var pay_status = 4;
                                    update_status(orderNo, uuid, pay_status);
                                    addOrderFailureRecord(orderNo, data.message);
                                }
                            }, 2000)
                        }else if(query_type == 'search_list') {
                            setTimeout(function(){
                                var data=searchlist();
                                if(data.code == 1001){
                                    var pay_status = 3;
                                    update_status(orderNo, uuid, pay_status);
                                    aftersearchinformation(data,preview);
                                }else{
                                    $('#success-hit').modal('hide');
                                    if (pay_type != 4) {
                                        $("#error-hits").text(data.message + pay_message);
                                    }else{
                                        $("#error-hits").text(data.message);
                                    }
                                    $('#error-download-hit').modal('show');
                                    var pay_status = 4;
                                    update_status(orderNo, uuid, pay_status);
                                    addOrderFailureRecord(orderNo, data.message);
                                }
                            }, 2000)
                        }else if((query_type == 'search_common')){
                            setTimeout(function(){
                                var data=queryReport();
                                if(data.code == 1001){
                                    var pay_status = 3;
                                    update_status(orderNo, uuid, pay_status);
                                    aftersearch(data,preview,0);
                                }else{
                                    $('#success-hit').modal('hide');
                                    if (pay_type != 4) {
                                        $("#error-hits").text(data.message + pay_message);
                                    }else{
                                        $("#error-hits").text(data.message);
                                    }
                                    $('#error-download-hit').modal('show');
                                    var pay_status = 4;
                                    update_status(orderNo, uuid, pay_status);
                                    addOrderFailureRecord(orderNo, data.message);
                                }
                            }, 2000)
                        }else{

                        }
                    }
                    getOrderDetail(orderNo, pay_type,  index, type, query_type, uuid, url, deliver_type, product_id, facilitator_uuid, product_name)

                } else if (data.code == 1001 && order_status == 2) {
                    if (n > 1800) {
                        $('#buy').modal('hide');
                        $("#error-hits").text('订单超时，请重新下单！');
                        $('#error-download-hit').modal('show');
                        addOrderFailureRecord(orderNo, '订单超时');
                        is_end = true;
                        return;
                    }
                    n++;
                    getOrderDetail(orderNo, pay_type,  index, type, query_type, uuid, url, deliver_type, product_id, facilitator_uuid, product_name)
                } else if (data.code == 1001 && order_status == 3) {
                    $('#success-hit').modal('hide');
                    $('#buy').modal('hide');
                    if (query_type == 'datum') {
                        if (deliver_type == 'file') {
                            $("#download-hit").text('下载成功');
                            $('#success-download-hit').modal('show');
                            sendDatumInform(product_name, facilitator_uuid);
                        } else {
                            $('#success-download-hit').modal('hide');
                            sendDatumInform(product_name, facilitator_uuid);
                        }
                        addDownload(product_id);
                        download_status = true;
                    }else{
                        addQuery(product_id);
                        $("#download-hit").text('查询成功');
                        $('#success-download-hit').modal('show');
                    }
                    addUsageLog(orderNo, uuid); //添加使用记录
                    addFacilitatorIncome(orderNo, uuid); //添加服务商收入
                    //调用添加使用记录
                    // clearTimeout(close_time);
                    is_end = true;
                } else if (data.code == 1001 && order_status == 4) {
                    $('#success-hit').modal('hide');
                    if (query_type == 'datum') {
                        if (pay_type != 4) {
                            $("#error-hits").text('下载失败，金额已回退到余额中');
                        } else {
                            $("#error-hits").text('下载失败');
                        }
                        $('#error-download-hit').modal('show');
                        addOrderFailureRecord(orderNo, '下载失败');
                    }
                    // }else{
                    //     if (pay_type != 4) {
                    //         $("#error-hits").text('查询失败，金额已回退到余额中1');
                    //     }else{
                    //         $("#error-hits").text('查询失败');
                    //     }
                    // }

                    // clearTimeout(close_time);
                    is_end = true;
                    //调用回调
                } else if(data.code == 3001){
                    $('#success-hit').modal('hide');
                    $("#error-hits").text(data.message);
                    $('#error-download-hit').modal('show');
                    is_end = true;
                } else {
                    console.log('该订单未支付');
                }
            }
        });
    }, 3000)
}

//添加使用记录
function addUsageLog(orderNo, uuid) {
    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    parameter = '{"uuid": "'+uuid+'", "order_number": "'+orderNo+'"}';
    enData = js_encrypt.encrypt(parameter);

    $.ajax({
        url: "/app/Usagelog/addUsagelog",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: false,//是否异步  默认为异步
        data: {param: enData},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执行

        },
        error: function () {
            console.log('添加使用记录失败');
        }

    });
}


function addOrderFailureRecord(orderNo,failure) {
    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    parameter = '{"orderNo": "'+orderNo+'", "failure": "'+failure+'"}';
    enData = js_encrypt.encrypt(parameter);

    $.ajax({
        url: "/app/Order/addOrderFailureRecord",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: false,//是否异步  默认为异步
        data: {param: enData},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执行
            console.log(data);
        },
        error: function () {
            console.log('添加订单失败记录');
        }

    });
}

//添加服务商收入
function addFacilitatorIncome(orderNo, uuid) {
    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    parameter = '{"uuid": "'+uuid+'", "order_number": "'+orderNo+'"}';
    enData = js_encrypt.encrypt(parameter);

    $.ajax({
        url: "/app/Facilitator/addFacilitatorIncome",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: true,//是否异步  默认为异步
        data: {param: enData},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执
        },
        error: function () {
            console.log('添加服务商收入错误');
        }
    });
}

//发送支付信息提示
function sendPayInform(amount, uuid) {
    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    parameter = '{"uuid": "'+uuid+'", "amount": "'+amount+'"}';
    enData = js_encrypt.encrypt(parameter);

    $.ajax({
        url: "/app/Inform/sendPayInform",//当前ajax请求的地址
        type: 'post',//请求的方式
        async: true,//是否异步  默认为异步
        data: {param: enData},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执
        },
        error: function () {
            console.log('发送付款通知失败');
        }
    });
}

//修改订单状态
function update_status(orderNo, uuid, pay_status) {
    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    key1 = '{"uuid": "'+uuid+'", ';
    key2 = '"pay_status": "'+pay_status+'", "order_number": "'+orderNo+'"}';
    key1 = js_encrypt.encrypt(key1);
    key2 = js_encrypt.encrypt(key2);

    $.ajax({
        url: "/app/Order/changeOrder",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: false,//是否异步  默认为异步
        data: {key1:key1, key2:key2},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执

        },
    });
}

//生成订单号
var orderNo;
function createOrderNum(query_type) {
    $.ajax({
        url: "/app/Order/createOrderNum",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: false,//是否异步  默认为异步
        data: {},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执行
            if (query_type == 'datum') {
                orderNo = data.data + 'datum';
            } else {
                orderNo = data.data + 'message';
            }
        }
    });
    return orderNo;
}

//创建订单
var result;
function createOrder(uuid, type, product_id,orderNo){

    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    key1 = '{"uuid": "'+uuid+'", "type": "'+type+'", ';
    key2 = '"product_id": "'+product_id+'","order_number": "'+orderNo+'"}';
    key1 = js_encrypt.encrypt(key1);
    key2 = js_encrypt.encrypt(key2);

    $.ajax({
        url: "/app/Order/createOrder",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: false,//是否异步  默认为异步
        data: {key1: key1, key2: key2},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执行
            result = data
        }
    });
    return result;
}

//微信快捷支付
function weChart(orderNo, index, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name, preview)
{
    var pay_type = 2;
    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    parameter = '{"pay_type": "'+pay_type+'", "type": "'+type+'", "order_number": "'+orderNo+'"}';
    enData = js_encrypt.encrypt(parameter);
    $.ajax({
        url: "/api/Pay/commonPay",//当前ajax请求的地址 /api/Pay/commonPay
        type: 'get',//请求的方式
        async: false,//是否异步  默认为异步
        data: {param:enData},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执行
            //修改订单成功并扣钱
            $('#qrcode').html("");
            $('#qrcode').qrcode(data.data);
            getOrderDetail(orderNo, pay_type,  index, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name, preview);
        }
    });
}

//支付宝支付
function aliPay(orderNo, index, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name, preview)
{
    var pay_type = 1;
    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    parameter = '{"pay_type": "'+pay_type+'", "type": "'+type+'", "order_number": "'+orderNo+'"}';
    enData = js_encrypt.encrypt(parameter);
    $.ajax({
        url: "/api/Pay/commonPay",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: false,//是否异步  默认为异步
        data: {param:enData},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执行
            if (data.code == 1001 && data.data) {
                var alipay_url = data.data;
                console.log('执行到');
                $("#turn_url").attr('href', alipay_url);
                $('#alipay_url').modal('show');
                getOrderDetail(orderNo, pay_type,  index, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name, preview);
            }
        },
    });
}

//免费支付
function free(orderNo, index, pay_type, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name,preview)
{
    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    var pay_status = 1;
    key1 = '{"uuid": "'+uuid+'", "pay_type": "'+pay_type+'", ';
    key2 = '"pay_status": "'+pay_status+'","order_number": "'+orderNo+'"}';
    key1 = js_encrypt.encrypt(key1);
    key2 = js_encrypt.encrypt(key2);
    $.ajax({
        url: "/app/Order/changeOrder",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: false,//是否异步  默认为异步
        data: {key1:key1,key2:key2},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执行
            getOrderDetail(orderNo, pay_type,  index, type, query_type,uuid, url, deliver_type, product_id, facilitator_uuid, product_name,preview);
        },
    });
}

var is_has_balance;
function isHasBalance(uuid, price)
{
    pub_key = $('#public_key').val();
    var js_encrypt = new JSEncrypt();
    //初始化公钥
    js_encrypt.setPublicKey(pub_key);
    param = '{"uuid": "'+uuid+'"}';
    param = js_encrypt.encrypt(param);

    $.ajax({
        url: "/app/Member/getMembershipBalance",//当前ajax请求的地址
        type: 'get',//请求的方式
        async: false,//是否异步  默认为异步
        data: {param:param},//当前ajax请求的参数
        dataType: "json",
        success: function (data) {//发送成功时的代码执行
            if(data.code == 1001 && parseFloat(data.data.balance) >= parseFloat(price)){
                is_has_balance = true;
            }else{
                is_has_balance = false;
            }
        },
    });
    return is_has_balance;
}

