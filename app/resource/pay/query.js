//信息查询
function parseform(){
    var form_string = $("#form_string").val();
    var form = JSON.parse(form_string);
    for (x in form){
        var name = form[x].name;
        if (form[x].type == 0) { //input
            //var value = $("input[name='" + name + "']").val();
            var value = $("#" + name).val();
            console.log(name,value)
            form[x].value = value;
            if((value=='') &&(form[x].must==1)){
              //layer.msg(name+'不能为空', {
              layer.msg('请求参数不能为空', {
                  icon: 5
              });
              return false
            }
        } else if (form[x].type == 1) { //select
            var value = $("select[name='" + name + "']").val();
            for (i in form[x].value) {
                if (form[x].value[i].value == value) {
                    form[x].value[i].sel = 1;
                }
            }
        } else if (form[x].type == 2) { //switch
            var value = $("input:checkbox[name=" + name + "]:checked").val();
            if (value == 'on') {
                form[x].value = form[x].value_yes;
            } else {
                form[x].value = form[x].value_no;
            }
        } else if (form[x].type == 3) { //time
            var value = $("#" + name).val();
            console.log(value)
            form[x].value = value;
            if((value=='') &&(form[x].must==1)){
              //layer.msg(name+'不能为空', {
              layer.msg('请求参数不能为空', {
                  icon: 5
              });
              return false
            }
        } else if (form[x].type == 4) { //手机验证
          var nopay=$("#nopay").val()//1:后台审核
          var vercode=$('#vercode').val()
          var value = $("#" + name).val();
          form[x].value=value
          form[x].vercode=vercode
          if(value==''){
            layer.msg('请求参数不能为空', {
                icon: 5
            })
            return false
          }
          if(nopay!=1){
            //var membership_grade=$("#membership_grade").val()
            //if(membership_grade!='vip'){
              if(vercode==''){
                layer.msg('验证码不能为空', {
                    icon: 5
                })
                return false
              }
            //}
          }
        }
    }
    return form;
}
function parseinfo(index){
  var info_string = $("#info_string").val();
  var info = JSON.parse(info_string);
  var paramArray = new Array();
  for (x in info) {
      if (info[x].default_param == 1) {
          value = $("#" + info[x].name + index).val();
          name = info[x].name;
          paramArray.push({
              name: name,
              value: value
          })
      }
  }
  return paramArray
}
function parseresponse(mod,data){
  if(mod==0){//api_type==2
    var info_string = $("#info_string").val();
  }else{//api_type==3,6
    var info_string = $("#info_string1").val();
  }
  var info = JSON.parse(info_string);
  for (x in info) {
      info[x].value = eval('data.data.response.' + info[x].name);
      if(typeof info[x].value=="undefined"){
          info[x].value='';
      }
  }
  var html = '';
  for (x in info) {
      html += '<tr><td class="tit">' + info[x].remind_text + '</td><td style="word-break:break-all;">' + info[x].value + '</td></tr>'
  }
  if(mod==0){
    $("#info_string").val(JSON.stringify(info));
  }else{
    $("#info_string1").val(JSON.stringify(info));
  }
  $("#tbody").html(html);
  $("#report").modal('show');
}
function queryReport() {//api_type==2时 前后台
    var form=parseform();
    if(!form){
      return false
    }
    var nopay=$("#nopay").val()//1:后台审核
    var id=$("#wnc_id").val();
    var api_type=$("#api_type").val();
    var datat
    $.ajax({
        url:'/app/Facilitator/query',
        type: 'post', //请求的方式
        async: false, //是否异步  默认为异步
        data: {
            id:id,
            api_type:api_type,
            form: JSON.stringify(form),
            nopay:nopay
        }, //当前ajax请求的参数  
        dataType: "json",
        success: function(data) { //发送成功时的代码执行
            datat=data
        },
        error: function() { //失败时的代码执行
            datat=false
        }
    })
    return datat
}

function queryReportSearch(index) {//api_type==3,6时，前后台都会使用，开始查询
    var paramArray=parseinfo(index);
    var nopay=$("#nopay").val()//1:后台审核
    var id=$("#wnc_id").val();
    var api_type=$("#api_type").val();
    if(api_type==1){//前台调用
      api_type=3;
    }else if(api_type==5){//前台调用
      api_type=6;
    }
    var datat;
    $.ajax({
        url:'/app/Facilitator/query',
        type: 'post', //请求的方式
        async: false, //是否异步  默认为异步
        data: {
            id:id,
            api_type:api_type,
            form: JSON.stringify(paramArray),
            nopay:nopay
        }, //当前ajax请求的参数  
        dataType: "json",
        success: function(data) { //发送成功时的代码执行
            datat=data

        },
        error: function() { //失败时的代码执行
            datat=false
        }
    })
    return datat
}

function queryReportSearchFacilitator(index) {//api_type==3,6 开始查询调试页面
    var paramArray=parseinfo(index);
    var nopay=$("#nopay").val()//1:后台审核
    var id=$("#wnc_id").val();
    var api_type=$("#api_type").val();
    $.ajax({
        url:'/app/Facilitator/query',
        type: 'post', //请求的方式
        async: false, //是否异步  默认为异步
        data: {
            id:id,
            api_type:api_type,
            form: JSON.stringify(paramArray),
            nopay:nopay,
            facilitator:1
        }, //当前ajax请求的参数  
        dataType: "json",
        success: function(data) { //发送成功时的代码执行
            if (typeof(data.data.statuscode) == "undefined"){
              $('.status_code').text('状态码：');
            }else{
              $('.status_code').text('状态码：'+data.data.statuscode);
            }
            if(data.code==1001){//查询成功
                if(typeof(data.data.request)=='string'){
                  data.data.request=JSON.parse(data.data.request)//将字符串转换成对象
                }
                var request = JSON.stringify(data.data.request, null, 2)//将对象转换成json字符串
                document.getElementById('request_code').innerText= request;
                hljs.highlightBlock($("#request_code")[0]);

                if(typeof(data.data.response)=='string'){
                  data.data.response=JSON.parse(data.data.response)//将字符串转换成对象
                }
                var response = JSON.stringify(data.data.response, null, 2)//将对象转换成json字符串
                document.getElementById('code').innerText= response;
                hljs.highlightBlock($("#code")[0]);

            }else{//查询失败
                if (typeof(data.data.request) == "undefined"){
                  document.getElementById('request_code').innerText=''
                }else{
                  if(typeof(data.data.request)=='string'){
                    data.data.request=JSON.parse(data.data.request)//将字符串转换成对象
                  }
                  var request = JSON.stringify(data.data.request, null, 2);//将对象转换成json字符串
                  document.getElementById('request_code').innerText= request;
                }
                hljs.highlightBlock($("#request_code")[0]);

                if (typeof(data.data.response) == "undefined"){
                  document.getElementById('code').innerText= '';
                }else{
                  if(typeof(data.data.response)=='string'){
                    data.data.response=JSON.parse(data.data.response)//将字符串转换成对象
                  }
                  var response = JSON.stringify(data.data.response, null, 2);//将对象转换成json字符串
                  document.getElementById('code').innerText= response;
                }
                hljs.highlightBlock($("#code")[0]);

                //layer.msg("查询失败，请重新尝试", {
                layer.msg(data.message,{
                    icon: 5
                });

            }
        },
        error: function() { //失败时的代码执行
            layer.msg("查询失败，请重新尝试", {
                icon: 5
            });
        }
    })
}

//查询报告
function queryReportFacilitaotr() {//api_type==1,2,4 调试页
    var form=parseform();
    if(!form){
      return false
    }
    var nopay=$("#nopay").val()//1:后台审核
    var id=$("#wnc_id").val();
    var api_type=$("#api_type").val();

    $.ajax({
        url:'/app/Facilitator/query',
        type: 'post', //请求的方式
        async: false, //是否异步  默认为异步
        data: {
            id:id,
            api_type:api_type,
            form: JSON.stringify(form),
            facilitator:1,
            nopay:nopay
        }, //当前ajax请求的参数  
        dataType: "json",
        success: function(data) { //发送成功时的代码执行
            if (typeof(data.data.statuscode) == "undefined"){
              $('.status_code').text('状态码：');
            }else{
              $('.status_code').text('状态码：'+data.data.statuscode);
            }
            if(data.code==1001){//查询成功
                if(typeof(data.data.request)=='string'){
                  data.data.request=JSON.parse(data.data.request)//将字符串转换成对象
                }
                var request = JSON.stringify(data.data.request, null, 2);//将对象转换成json字符串
                document.getElementById('request_code').innerText= request;
                hljs.highlightBlock($("#request_code")[0]);

                if(typeof(data.data.response)=='string'){
                  data.data.response=JSON.parse(data.data.response)//将字符串转换成对象
                }
                var response = JSON.stringify(data.data.response, null, 2);//将对象转换成json字符串
                document.getElementById('code').innerText= response;
                hljs.highlightBlock($("#code")[0]);
            }else{//查询失败
                if (typeof(data.data.request) == "undefined"){
                  document.getElementById('request_code').innerText=''
                }else{
                  if(typeof(data.data.request)=='string'){
                    data.data.request=JSON.parse(data.data.request)//将字符串转换成对象
                  }
                  var request = JSON.stringify(data.data.request, null, 2);//将对象转换成json字符串
                  document.getElementById('request_code').innerText= request;
                }
                hljs.highlightBlock($("#request_code")[0]);

                if (typeof(data.data.response) == "undefined"){
                  document.getElementById('code').innerText= '';
                }else{
                  if(typeof(data.data.response)=='string'){
                    data.data.response=JSON.parse(data.data.response)//将字符串转换成对象
                  }
                  var response = JSON.stringify(data.data.response, null, 2);//将对象转换成json字符串
                  document.getElementById('code').innerText= response;
                }
                hljs.highlightBlock($("#code")[0]);
                layer.msg(data.message, {
                    icon: 5
                });

            }
        },
        error: function() { //失败时的代码执行
            layer.msg("查询失败，请重新尝试", {icon: 5});
        }
    })
}


//生成报告
function gen_report_js(index){//api_type==4,6 生成报告
  var api_type=$("#api_type").val()
  var info_string
  var com
  if(api_type==4){
    info_string = $("#info_string").val()
    com=$(".result-list")
  }else{//6
    info_string=$("#info_string1").val()
    com=$(".result-list1")
  }
  console.log(info_string)
  var info = JSON.parse(info_string)
  console.log(info)
  if($.isArray(info.list)){//api_type==4
    if(info.list.length>1){//多列表
      var contentArray = new Array();

      com.children('li').each(function(i,val){
        if(index==i){
          var html=''
          $(this).find('.result-list-inner').children('li').each(function(j,v){
            //console.log(j,v)
            var conArray=new Array()
            $(this).find('.res-item').each(function(k,vk){
              var title=$(this).children('span').html()
              var content=$(this).html()
              content=content.replace(title,'')
              title=title.replace('：','')
              html += '<tr><td class="tit">' + title + '</td><td style="word-break:break-all;">' + content + '</td></tr>'
              console.log(content)
              conArray.push({remind_text:title,value:content})
            })
            contentArray.push(conArray)
          });
          console.log(contentArray)
          // var info_string=$("#info_string").val()
          // var info=JSON.parse(info_string)
          info.sample=contentArray
          console.log(info)
          if(api_type==4){
            $("#info_string").val(JSON.stringify(info))
          }else{//6
            $("#info_string1").val(JSON.stringify(info))
          }

          $("#tbody").html(html);
          $("#report").modal('show'); //调起支付页面
          //保存快照
          var id=$("#wnc_id").val()
          var information_id = id
          var content=JSON.stringify(contentArray)
          var form=parseform();
          if(!form){
            return false
          }
          addSnapShot(information_id, content, form);
        }
      })
    }else{//单列表
      com.children('li').each(function(i,val){
        if(index==i){
          var html=''
          $(this).find('.resbox').children('div').each(function(j,v){
            //console.log(j,v)
            var title=$(this).children('span').html()
            var content=$(this).html()
            content=content.replace(title,'')
            title=title.replace('：','')
            for (x in info.list[0].list) {
                if(info.list[0].list[x].remind_text==title){
                  info.list[0].list[x].value=content
                }
            }
            if(api_type==4){
              $("#info_string").val(JSON.stringify(info))
            }else{//6
              $("#info_string1").val(JSON.stringify(info))
            }
            html += '<tr><td class="tit">' + title + '</td><td>' + content + '</td></tr>'
            console.log(content)
          });
          $("#tbody").html(html);
          $("#report").modal('show'); //调起支付页面
          //保存快照
          var id=$("#wnc_id").val()
          var information_id = id
          var content
          if(api_type==4){
            content=$("#info_string").val()
          }else{//6
            content=$("#info_string1").val()
          }
          var form=parseform();
          if(!form){
            return false
          }
          addSnapShot(information_id, content, form);
        }
      })
    }
  }else{
    com.children('li').each(function(i,val){
      if(index==i){
        var html=''
        $(this).find('.resbox').children('div').each(function(j,v){
          //console.log(j,v)
          var title=$(this).children('span').html()
          var content=$(this).html()
          content=content.replace(title,'')
          title=title.replace('：','')
          for (x in info) {
              if(info[x].remind_text==title){
                info[x].value=content
              }
          }
          if(api_type==4){
            $("#info_string").val(JSON.stringify(info))
          }else{//6
            $("#info_string1").val(JSON.stringify(info))
          }
          html += '<tr><td class="tit">' + title + '</td><td>' + content + '</td></tr>'
          console.log(content)
        });
        $("#tbody").html(html);
        $("#report").modal('show'); //调起支付页面
        //保存快照
        var id=$("#wnc_id").val()
        var information_id = id
        var content
        if(api_type==4){
          content=$("#info_string").val()
        }else{//6
          content=$("#info_string1").val()
        }
        var form=parseform();
        if(!form){
          return false
        }
        addSnapShot(information_id, content, form);
      }
    })
  }
}

/**
 * 添加快照
 */
function addSnapShot(information_id, content, form){
    $.ajax({
        url: '/api/SnapShot/addSnapShot', //当前ajax请求的地址
        type: 'post', //请求的方式
        async: true, //是否异步  默认为异步
        data: {
            information_id: information_id,
            content: content,
            parameter: JSON.stringify(form)
        }, //当前ajax请求的参数  
        dataType: "json",
        success: function(data) { //发送成功时的代码执行
            if(data.code==1001){
                $("#snapshot_id").val(data.data)
            }
        },
        error: function() { //失败时的代码执行

        }
    });
}
layui.use(['laypage', 'layer'], function () {
    var laypage = layui.laypage,
        layer = layui.layer;
    window.aftersearch = function(data,preview,mod) {
      var id=$("#wnc_id").val();
      var api_type=$("#api_type").val();
      if(api_type==1){//前台调用
        api_type=3;
      }else if(api_type==5){//前台调用
        api_type=6;
      }
      var form=parseform();
      console.log(data)
      if(data.code==1001){//查询成功
          if(api_type==6){
            var info_string = $("#info_string1").val()
            var info = JSON.parse(info_string)
            console.log(info)
            $("#result-list1").show()
            $("#page1").show()
            $('.temp-tips').show()
            $("#result-list").hide()
            $("#page").hide()
            if($.isArray(info.list)){//api_type==4
              if(info.list.length==1){//单列表
                laypage.render({
                    elem: 'page1',
                    count: data.data.response.list[0].list.length,
                    limit: 8,
                    limits: [8, 10, 20],
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                    jump: function (obj) {
                        //模拟渲染
                        console.log(obj)
                        document.getElementById('result-list1').innerHTML = function () {
                            var arr = [],
                                thisData = data.data.response.list[0].list.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);

                            var lidata;
                            console.log(thisData)

                            layui.each(thisData, function (index, item) {
                                lidata = '<div class="resbox"><input type="hidden" value='+index+' id="start_query_index"/> ';
                                for (x in item) {
                                        if (x == 0) {
                                            lidata += '<div class="res-title"><span class="txt">'
                                        } else {
                                            lidata += '<div class="res-item"><span class="txt">'
                                        }
                                        lidata += item[x].remind_text + '：'
                                        lidata += '</span>' + item[x].value

                                        lidata += '</div>'



                                }

                                lidata += '</div><a href="javascript:;" class="resbutton" onclick="gen_report(' + index + ')">生成报告</a>';

                                arr.push('<li>' + lidata + '</li>');

                            });
                            return arr.join('');
                        }();
                    }
                });
              }else{//多列表
                var lidata;
                var default_form=data.data.response.default_form
                lidata = '<div class="resbox"> ';
                for (x in default_form) {
                  console.log(x)
                  lidata += '<div class="res-title"><span class="txt">'
                  lidata += '</span>' + default_form[x].remind_text+':'+default_form[x].value
                  lidata += '</div>'
                }
                lidata += '</div>'
                $('#default_form').html(lidata)
                laypage.render({
                    elem: 'page',
                    count: data.data.response.list.length,
                    limit: 8,
                    limits: [8, 10, 20],
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                    jump: function (obj) {
                        //模拟渲染
                        console.log(obj)
                        document.getElementById('result-list').innerHTML = function () {
                            var arr = [],
                                thisData = data.data.response.list.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
                            var lidata;

                            layui.each(thisData, function (index, item) {
                                console.log(index,item)
                                lidata = '<div class="resbox">';
                                lidata += '<div class="res-title"><span class="txt">'
                                lidata += item.explain
                                lidata += '</span>'

                                lidata += '</div><a href="javascript:;" class="resbutton" onclick="gen_report(' + index + ')">生成报告</a>';
                                lidata += '<ul class="result-list-inner">'
                                for(x in item.list){
                                  lidata += '<li>'
                                  for(y in item.list[x]){
                                    console.log(item.list[x][y])
                                    lidata += '<div class="res-item"><span class="txt">'
                                    lidata += item.list[x][y].remind_text + '：'
                                    lidata += '</span>' + item.list[x][y].value
                                    lidata += '</div>'
                                  }
                                  lidata += '</li>'
                                }
                                lidata += '</ul>'
                                lidata += '</div>'

                                arr.push('<li>' + lidata + '</li>');

                            });
                            return arr.join('');
                        }();
                    }
                });
              }
            }
          }else{
            parseresponse(mod,data)
            //保存快照
            var information_id = id;
            if(mod==0){
              var content=$("#info_string").val();
            }else{
              var content=$("#info_string1").val();
            }
            addSnapShot(information_id, content, form);
          }
      }else{//查询失败，通知服务商并自动下架
          layer.msg(data.message, {
              icon: 5
          });
          if(preview!=1){
            var auto_shelve=$("#auto_shelve").val()
            if(auto_shelve==1){
                shelves(id, api_type, form);
            }
          }
      }
    }
  })

//添加查询量
function addQuery(product_id)
{
    var id = parseInt(product_id);
    $.ajax({
        url: "/app/information/addInformationQueries",//当前ajax请求的地址
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

//下架
function shelves(id, api_type, form) {
    $.ajax({
        url: '/app/Information/shelves', //当前ajax请求的地址
        type: 'post', //请求的方式
        async: true, //是否异步  默认为异步
        data: {
            id: id,
            api_type: api_type,
            form: form
        }, //当前ajax请求的参数  
        dataType: "json",
        success: function (data) { //发送成功时的代码执行
            if (data.code == 2001) {
                layer.msg("查询失败，已自动下架该产品，给您带来不便，请谅解", {
                    icon: 5
                });
            } else {
                layer.msg("查询失败，请重新尝试", {
                    icon: 5
                });
            }
        },
        error: function () { //失败时的代码执行
            layer.msg("查询失败，请重新尝试", {
                icon: 5
            });
        }
    })
}
layui.use(['laypage', 'layer'], function () {
    var laypage = layui.laypage,
        layer = layui.layer;

    function query(form) {
        var nopay=$("#nopay").val()//1:后台审核
        var id = $("#wnc_id").val()
        var api_type = $("#api_type").val()
        if(api_type==4){

        }else{
          if(api_type==3){
            api_type=1
          }else if(api_type==6){
            api_type=5
          }
        }
        var datat
        $.ajax({
            url: '/app/Facilitator/query',
            type: 'post', //请求的方式
            async: false, //是否异步  默认为异步
            data: {
                id: id,
                api_type: api_type,
                form: form,
                nopay:nopay
            }, //当前ajax请求的参数  
            dataType: "json",
            success: function (data) { //发送成功时的代码执行
                datat=data

            },
            error: function () { //失败时的代码执行
                datat=false
            }
        })
        return datat
    }


    var form = $("#form_string").val()

    if (form == '[]') {
        query(form)
    }

    window.searchlist = function() {//api_type==1 预览页，前台，api_type==3 列表调试页，api_type==4 前后台
        console.log('into searchlist')
        var uuid = $("#uuid").val();
        if (uuid == '') {
            $('#login').modal('show');
        } else {
            var form=parseform();
            if(!form){
              return false
            }
            return query(JSON.stringify(form))
        }
    }

    //function aftersearchinformation(data,preview){
    window.aftersearchinformation=function(data,preview){
      var id=$("#wnc_id").val();
      var api_type=$("#api_type").val();
      var form=parseform();
      if (data.code == 1001) {//查询成功
          if (data.data.response == '') {
              layer.msg("暂无数据", {
                  icon: 5
              });
          } else {
            var info_string = $("#info_string").val()
            var info = JSON.parse(info_string)
            console.log(info)
            $("#result-list").show()
            $("#page").show()
            $('.temp-tips').hide()
            $("#result-list1").hide()
            $("#page1").hide()
            if($.isArray(info.list)){//api_type==4
              if(info.list.length==1){//单列表
                laypage.render({
                    elem: 'page',
                    count: data.data.response.list[0].list.length,
                    limit: 8,
                    limits: [8, 10, 20],
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                    jump: function (obj) {
                        //模拟渲染
                        console.log(obj)
                        document.getElementById('result-list').innerHTML = function () {
                            var arr = [],
                                thisData = data.data.response.list[0].list.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);

                            var lidata;
                            console.log(thisData)

                            layui.each(thisData, function (index, item) {
                                lidata = '<div class="resbox"><input type="hidden" value='+index+' id="start_query_index"/> ';
                                for (x in item) {
                                        if (x == 0) {
                                            lidata += '<div class="res-title"><span class="txt">'
                                        } else {
                                            lidata += '<div class="res-item"><span class="txt">'
                                        }
                                        lidata += item[x].remind_text + '：'
                                        lidata += '</span>' + item[x].value

                                        lidata += '</div>'



                                }
                                if(api_type==4){
                                  lidata += '</div><a href="javascript:;" class="resbutton" onclick="gen_report(' + index + ')">生成报告</a>';
                                }else{
                                  lidata += '</div><a href="javascript:;" class="resbutton" onclick="start_query(' + index + ')">开始查询</a>';
                                }
                                arr.push('<li>' + lidata + '</li>');

                            });
                            return arr.join('');
                        }();
                    }
                });
              }else{//多列表
                var lidata;
                var default_form=data.data.response.default_form
                lidata = '<div class="resbox"> ';
                for (x in default_form) {
                  console.log(x)
                  lidata += '<div class="res-title"><span class="txt">'
                  lidata += '</span>' + default_form[x].remind_text+':'+default_form[x].value
                  lidata += '</div>'
                }
                lidata += '</div>'
                $('#default_form').html(lidata)
                laypage.render({
                    elem: 'page',
                    count: data.data.response.list.length,
                    limit: 8,
                    limits: [8, 10, 20],
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                    jump: function (obj) {
                        //模拟渲染
                        console.log(obj)
                        document.getElementById('result-list').innerHTML = function () {
                            var arr = [],
                                thisData = data.data.response.list.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
                            var lidata;

                            layui.each(thisData, function (index, item) {
                                console.log(index,item)
                                lidata = '<div class="resbox">';
                                lidata += '<div class="res-title"><span class="txt">'
                                lidata += item.explain
                                lidata += '</span>'

                                lidata += '</div><a href="javascript:;" class="resbutton" onclick="gen_report(' + index + ')">生成报告</a>';
                                lidata += '<ul class="result-list-inner">'
                                for(x in item.list){
                                  lidata += '<li>'
                                  for(y in item.list[x]){
                                    console.log(item.list[x][y])
                                    lidata += '<div class="res-item"><span class="txt">'
                                    lidata += item.list[x][y].remind_text + '：'
                                    lidata += '</span>' + item.list[x][y].value
                                    lidata += '</div>'
                                  }
                                  lidata += '</li>'
                                }
                                lidata += '</ul>'
                                lidata += '</div>'

                                arr.push('<li>' + lidata + '</li>');

                            });
                            return arr.join('');
                        }();
                    }
                });
              }
            }else{
              laypage.render({
                  elem: 'page',
                  count: data.data.response.length,
                  limit: 8,
                  limits: [8, 10, 20],
                  layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                  jump: function (obj) {
                      //模拟渲染
                      console.log(obj)
                      document.getElementById('result-list').innerHTML = function () {
                          var arr = [],
                              thisData = data.data.response.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);

                          var lidata;
                          layui.each(thisData, function (index, item) {
                              lidata = '<div class="resbox"><input type="hidden" value='+index+' id="start_query_index"/> ';
                              for (x in info) {
                                  if (info[x].show == 1) {
                                      if (x == 0) {
                                          lidata += '<div class="res-title"><span class="txt">'
                                      } else {
                                          lidata += '<div class="res-item"><span class="txt">'
                                      }
                                      lidata += info[x].remind_text + '：'
                                      if (info[x].name == '子节点name') {//搜索api返回数据为单变量数组
                                          lidata += '</span>' + item
                                      } else {
                                          lidata += '</span>' + eval('item.' + info[x].name)
                                      }
                                      lidata += '</div>'
                                  }
                                  if (info[x].default_param == 1) {
                                      if (info[x].name == '子节点name') {//搜索api返回数据为单变量数组
                                          lidata += '<input type="hidden" id=' + info[x].name + index + ' value="' + item + '"/>'
                                      } else {
                                          lidata += '<input type="hidden" id=' + info[x].name + index + ' value="' + eval('item.' + info[x].name) + '"/>'
                                      }
                                  }
                              }
                              if(api_type==4){
                                lidata += '</div><a href="javascript:;" class="resbutton" onclick="gen_report(' + index + ')">生成报告</a>';
                              }else{
                                lidata += '</div><a href="javascript:;" class="resbutton" onclick="start_query(' + index + ')">开始查询</a>';
                              }
                              arr.push('<li>' + lidata + '</li>');

                          });
                          return arr.join('');
                      }();
                  }
              });
            }
          }
      } else {//查询失败
          layer.msg(data.message, {
              icon: 5
          });
          //var preview=$("#preview").val()
          if(preview!=1){
            var auto_shelve=$("#auto_shelve").val()
            if(auto_shelve==1){
                shelves(id, api_type, form)
            }
          }
      }
    }
});

var nameArray
var same_str=''
var query_first=''
function check_valid(name){
  var isposition= arguments[1] || 0;
  var name_ori=name
  //console.log($("#code").text())
  var str=$("#code").text().replace(/[\r\n]/g,"")
  //console.log(str)
  if(str=='{}'){
    query_first=1
    var debug_config_id=$("#debug_config_id").val()
    if(debug_config_id!=''){
      query_first=''
    }
  }else{
    query_first=''
    var resultArray=JSON.parse($("#code").text());
    nameArray=name.split('.')
    console.log(name,nameArray,resultArray)
    check_array(0,resultArray,name_ori,isposition)
  }
}
function check_array(n,resultArray,name,isposition) {
    console.log(n, resultArray)
    var same = 0
    var nametemp, indextemp
    for (i in resultArray) {
        console.log(n, nameArray[n], i, resultArray[i])
        var ret = /^(\w+)\[(\d+)\]$/;
        if (ret.test(nameArray[n])) {//传递的变量为数组形式：list[0]
            nametemp = nameArray[n].replace(/\[(\d+)\]/g, "")
            indextemp = nameArray[n].replace(/^(\w+)\[/g, "")
            indextemp = indextemp.replace(/\]/g, "")
            console.log(nametemp, indextemp)
        } else {
            nametemp = nameArray[n]
            indextemp = ''
        }

        if (nametemp == i) {
            console.log('same' + n + " " + i)
            same = 1
            if (n < (nameArray.length - 1)) {
                if (indextemp == '') {
                    check_array(n + 1, resultArray[i], name, isposition)
                } else {
                    check_array(n + 1, resultArray[i][indextemp], name, isposition)
                }
            } else {
                //console.log($.isPlainObject(resultArray[i]))
                //console.log($.isArray(resultArray[i]))
                console.log(isposition)
                if (isposition == 0) {//非节点位置
                    if ($.isPlainObject(resultArray[i])) {
                        same = 0
                    }
                }
            }
        }
    }

    if (same == 0) {
        console.log(nameArray[n])
        if (nameArray[n] == '') {
            console.log(name)
            same_str = name
        } else {
            same_str = nameArray[n]
        }
    }
}
function limited_check(preview){
  var nopay=$("#nopay").val()
  if(nopay==1){//总后台审核
    return true;
  }else if(preview==1){
    return true;
  }else{
    var person_grade=$("#person_grade").val()
    var enterprise_grade=$("#enterprise_grade").val()
    var limited_type=$("#limited_type").val()
    console.log(limited_type)
    if((limited_type=='实名认证或企业认证用户')&&((person_grade==1)||(enterprise_grade==1))){
      return true
    }else if((limited_type=='实名认证用户')&&(person_grade==1)){
      return true
    }else if((limited_type=='企业认证用户')&&(enterprise_grade==1)){
      return true
    }else if(limited_type=="不限制"){
      return true
    }else if(limited_type==""){
      return true
    }else{
      layer.msg('您的用户类型限制查询此信息', {
          icon: 5
      });
      return false

    }
  }
}
function shelves_check(preview){
  var nopay=$("#nopay").val()
  if(nopay==1){//总后台审核
    return true;
  }else if(preview==1){
    return true;
  }else{
    var shelves=$("#shelves").val()
    if(shelves==1){
      return true;
    }else if(shelves==2){
      layer.msg('此产品已下架', {
          icon: 5
      });
      return false
    }else if(shelves==3){
      layer.msg('此产品尚未审核', {
          icon: 5
      });
      return false
    }
  }
}
