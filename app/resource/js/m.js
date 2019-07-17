// JavaScript Document
function SwapTab(name,title,content,Sub,cur){
  $(name+' '+title).click(function(){
	  $(this).addClass(cur).siblings().removeClass(cur);
	  $(content+" > "+Sub).eq($(name+' '+title).index(this)).fadeIn().siblings().hide();
  });
}
$(function(){
	new SwapTab('.t-tabs','li','.t-body','.t-pane','active')
	//实名认证切换
	new SwapTab('.h-tabs','li','.hor-tab-content','.hor-form','active')

	// 侧边导航
	$('.dropdown .m-navbox').click(function(event) {

		if ($(this).parents('li').hasClass('active')) {
			$(this).parents('li').removeClass('active')
			$(this).parents('li').find('.m-sub-nav').slideUp('fast');
		} else {
			$('.dropdown').removeClass('active')
			$('.m-sub-nav').slideUp('fast');
            $('.m-navbox').parents().removeClass('active');
			$(this).parents('li').addClass('active')
			$(this).parents('li').find('.m-sub-nav').slideDown('fast');
		}
	});


	$('.m-sub-nav li').click(function(event) {
		$(this).addClass('active').siblings('li').removeClass('active')
	});





	// 默认模板-API设置    接口调用地址：
	$(".set-switch").click(function(event) {
		if($(this).find('.weui-switch-cp__input').is(':checked')) {
		    $('#hiSet').show();
		}else{
			$('#hiSet').hide();
		}
	});


	$('#btnHeader').click(function(event) {
		var str = '<div class="hor-jk-item header">'
			+'<input type="text" placeholder="" class="hor-input hor-xs-input" value="name" />'
			+'<input type="text" value="value" placeholder="" class="hor-input" />'
			+'<span class="btn-del jk-del"><i class="iconfont icon-delete"></i> 删除</span>'
		+'</div>';
		$('#jkBodys').append(str)
	});

	// 添加默认参数 addDefault
	$('#addDefault').click(function(event) {
		var str2 = '<div class="hor-jk-item default">'
			+'<input type="text" placeholder="" class="hor-input hor-xs-input" value="name" />'
			+'<input type="text" value="value" placeholder="" class="hor-input" />'
			+'<span class="btn-del jk-del"><i class="iconfont icon-delete"></i> 删除</span>'
		+'</div>';
		$('#defaultBody').append(str2)
	});


	$(document).on('click', '.jk-del', function(event) {
		event.preventDefault();
		$(this).parents('.hor-jk-item').remove();
	});


// 添加表单===========================
	// 单行文本输入：
  var form_string=$("#form_string").val()
  if((typeof(form_string)!='undefined')&&(form_string!='')){
    console.log(form_string)
    var form=JSON.parse(form_string)
    var fn = form.length
  }
	$('#AddTextBox').click(function(event) {

		/* Act on the event */
		$("#myModal4").modal('hide');  //手动关闭

		var txtPlace = $('.hor-text-tips').val();
		var txtName = $('.hor-text-name').val();
		var txtValue = $('.hor-text-value').val();
    var txtMust=0
    $('.weui-switch-cp__input_input').each(function(index){
      txtMust=$(this).prop('checked')
    })

		var strTxt = '<div class="hor-group clearfix">'
				+'<div class="text">'+txtName+'：</div>'
				+'<div class="bd">'
        +'<div class="label-item">'
					+'<input type="text" placeholder="请输入'+txtPlace+'" name="'+txtName+'" value="'+txtValue+'" id="'+txtName+'" class="hor-input" />'
          +'</div>'
          +'<div class="label-item">'
              +'<span class="switch-text">是否必填：</span>'
              +'<label for="switchI'+fn+'" class="weui-switch-cp weui-switch-menu-input" data-index="'+fn+'">'
              if(txtMust==true){
                txtMust=1
                strTxt+='<input id="switchI'+fn+'" class="weui-switch-cp__input weui-switch-cp__input_input" checked="checked" type="checkbox" >'
              }else{
                  txtMust=0
                  strTxt+='<input id="switchI'+fn+'" class="weui-switch-cp__input weui-switch-cp__input_input" type="checkbox" >'
              }
                  strTxt+='<div class="weui-switch-cp__box"></div>'
              strTxt+='</label>'
          strTxt+='</div>'
					strTxt+='<span class="btn-del hor-del" data-index="'+fn+'"><i class="iconfont icon-delete"></i> 删除</span>'
				strTxt+='</div>'
			strTxt+='</div>';
		$('#fromSection').append(strTxt)
    var form_string=$("#form_string").val()
    var form=JSON.parse(form_string)
    console.log(form,form.length)
    fn=form.length+1
    //console.log(form)
    var data={type: 0, remind_text: txtPlace, name: txtName, value: txtValue,must:txtMust}
    form.push(data)
    //console.log(form)
    $("#form_string").val(JSON.stringify(form))

	});
	// 多行选择框
	$('#AddSelectAdd').click(function(event) {
		/* Act on the event */
		$("#myModal4").modal('hide');  //手动关闭

		var selecttPlace = $('.hor-select-tips0').val();
		var selectName = $('.hor-select-name0').val();
		var Voption ="";
    var optionArray=new Array();
    var option=""
		$('.hor-in-group').each(function(num) {
			Voption += '<option value="'+$('.hor-select-value'+num).val()+'">'+$('.hor-select-tips'+num).val()+'</option>';
      option={remind_text:$('.hor-select-tips'+num).val(),value:$('.hor-select-value'+num).val()}
      optionArray.push(option)
		});
		var strSelect = '<div class="hor-group clearfix">'
				+'<div class="text">'+selectName+'：</div>'
				+'<div class="bd">'
					+'<select name="'+selectName+'" id="selectName" class="hor-input">'+Voption+'</select>'
					+'<span class="btn-del hor-del" data-index="'+fn+'"><i class="iconfont icon-delete"></i> 删除</span>'
				+'</div>'
			+'</div>';
		$('#fromSection').append(strSelect)
    var form_string=$("#form_string").val()
    var form=JSON.parse(form_string)
    fn=form.length+1
    //console.log(form)
    var data={type: 1, name: selectName, value: optionArray}
    form.push(data)
    //console.log(form)
    //console.log(JSON.stringify(form))
    $("#form_string").val(JSON.stringify(form))
	});

	// 添加一行
	var nn =1
	$('#addGroup').click(function(event) {
		var Gx = '<div class="hor-in-group">'
                	+'<div class="hor-group clearfix">'
                       +'<div class="text">提示文字：</div>'
                        +'<div class="bd">'
                            +'<input type="text" placeholder="请输入提示文字" class="hor-input hor-select-tips'+nn+'">'
                        +'</div>'
                    +'</div>'
                    // +'<div class="hor-group clearfix">'
                    //     +'<div class="text">name：</div>'
                    //    +' <div class="bd">'
                    //         +'<input type="text" placeholder="name" class="hor-input hor-select-name'+nn+'">'
                    //     +'</div>'
                    // +'</div>'
                    +'<div class="hor-group clearfix">'
                        +'<div class="text">value：</div>'
                        +'<div class="bd">'
                            +'<input type="text" placeholder="value" class="hor-input hor-select-value'+nn+'">'
                        +'</div>'
                   +' </div>'
                +'</div>';
        nn = nn+1;
        $('#selectGroup').append(Gx)
	});

	var ns = 0
	// 添加开关
	$('#AddSwAdd').click(function(event) {
		/* Act on the event */
		$("#myModal4").modal('hide');  //手动关闭

		var swTips = $('.hor-sw-tips').val();
		var swName = $('.hor-sw-name').val();
		var yValue = $('.hor-y-value').val();
		var nValue = $('.hor-n-value').val();

		var strSW = '<div class="hor-group clearfix">'
							+'<div class="text">'+swTips+'：</div>'
							+'<div class="bd">'
								+'<span class="switch-text">'+swTips+'</span>'
								+'<label for="switchCP'+ns+'" class="weui-switch-cp">'
							       +' <input id="switchCP'+ns+'" class="weui-switch-cp__input" type="checkbox" checked="checked" value="'+yValue+'" name="'+swName+'">'
							        +'<div class="weui-switch-cp__box"></div>'
							    +'</label>'
							    +'<span class="btn-del hor-del" data-index="'+fn+'"><i class="iconfont icon-delete"></i> 删除</span>'
							+'</div>'
						+'</div>';
		$('#fromSection').append(strSW)
		ns =ns+1;
    var form_string=$("#form_string").val()
    var form=JSON.parse(form_string)
    fn=form.length+1
    //console.log(form)
    var data={type: 2, remind_text: swTips, name:swName, value_yes: yValue,value_no:nValue}
    form.push(data)
    //console.log(form)
    //console.log(JSON.stringify(form))
    $("#form_string").val(JSON.stringify(form))
	});
  //添加时间选择控件
  $('.AddTime').click(function(event) {
    console.log(event.currentTarget.dataset.index)
    var no=event.currentTarget.dataset.index
		/* Act on the event */
		$("#myModalTime").modal('hide');  //手动关闭
    $("#myModal4").modal('hide');  //手动关闭

		var txtPlace = $('.hor-time-tips').val();
    console.log(txtPlace)
		var txtName = $('.hor-time-name').val();
		//var txtValue = $('.hor-text-value').val();
    var txtMust=0
    $('.weui-switch-cp__input_time').each(function(index){
      txtMust=$(this).prop('checked')
    })

		var strTxt = '<div class="hor-group clearfix">'
				+'<div class="text">'+txtName+'：</div>'
				+'<div class="bd">'
        +'<div class="label-item">'
					+'<input type="text" placeholder="请输入'+txtPlace+'" name="'+txtName+'" id="'+txtName+'" class="hor-input" />'
          +'</div>'
          +'<div class="label-item">'
              +'<span class="switch-text">是否必填：</span>'
              +'<label for="switchT'+fn+'" class="weui-switch-cp weui-switch-menu-input" data-index="'+fn+'">'
              if(txtMust==true){
                txtMust=1
                strTxt+='<input id="switchT'+fn+'" class="weui-switch-cp__input weui-switch-cp__input_time" checked="checked" type="checkbox" >'
              }else{
                  strTxt+='<input id="switchT'+fn+'" class="weui-switch-cp__input weui-switch-cp__input_input" type="checkbox" >'
              }
                  strTxt+='<div class="weui-switch-cp__box"></div>'
              strTxt+='</label>'
          strTxt+='</div>'
					strTxt+='<span class="btn-del hor-del" data-index="'+fn+'"><i class="iconfont icon-delete"></i> 删除</span>'
				strTxt+='</div>'
			strTxt+='</div>'
      strTxt+='<script>'
      strTxt+='layui.use(\'laydate\', function(){'
        strTxt+='var laydate = layui.laydate;'

        strTxt+='var type,format;'
        // if(no==1){
        //   strTxt+='type=\'date\';'
        //   strTxt+='format=\'yyyyMMdd\';'
        // }else if(no==2){
        //   strTxt+='type=\'datetime\';'
        //   strTxt+='format=\'yyyyMMddHHmmss\';'
        // }else if(no==3){
        //   strTxt+='type=\'datetime\';'
        //   strTxt+='format=\'yyyy-MM-dd HH:mm:ss\';'
        // }else if(no==4){
        //   strTxt+='type=\'datetime\';'
        //   strTxt+='format=\'yyyy-MM-dd HH:mm:ss\';'
        // }else if(no==5){
        //   strTxt+='type=\'datetime\';'
        //   strTxt+='format=\'yyyy-MM-dd\';'
        // }else if(no==6){
          strTxt+='type=\'datetime\';'
          strTxt+='format=\'yyyy-MM-dd HH:mm:ss\';'
        //}


        strTxt+='laydate.render({'
          strTxt+='elem: \'#'+txtName+'\''
          strTxt+=',type:type'
          strTxt+=',format: format'
          strTxt+=',done: function(value, date){'
            // strTxt+='console.log(value,date);'
            // if(no==3){
            //   strTxt+='var newdate=new Date('
            //           strTxt+='parseInt(date.year, 10) || null,'
            //           strTxt+='(parseInt(date.month, 10) || 1) - 1,'
            //           strTxt+='parseInt(date.date, 10) || null,'
            //           strTxt+='parseInt(date.hours, 10) || null,'
            //           strTxt+='parseInt(date.minutes, 10) || null,'
            //           strTxt+='parseInt(date.seconds, 10) || null'
            //           strTxt+=').getTime() / 1000;'
            //           strTxt+='console.log(newdate);'
            //   strTxt+='$(\'#'+txtName+'\').val(newdate);'
            // }else if(no==4){
            //   strTxt+='$(\'#'+txtName+'\').val(new Date('
            //           strTxt+='parseInt(date.year, 10) || null,'
            //           strTxt+='(parseInt(date.month, 10) || 1) - 1,'
            //           strTxt+='parseInt(date.date, 10) || null,'
            //           strTxt+='parseInt(date.hours, 10) || null,'
            //           strTxt+='parseInt(date.minutes, 10) || null,'
            //           strTxt+='parseInt(date.seconds, 10) || null'
            //           strTxt+=').getTime())'
            // }
          strTxt+='}'
        strTxt+='})'
      strTxt+='})'
      strTxt+='</script>'
      console.log(strTxt)
		$('#fromSection').append(strTxt)
    var form_string=$("#form_string").val()
    var form=JSON.parse(form_string)
    console.log(form,form.length)
    fn=form.length+1
    //console.log(form)
    var data={type: 3, remind_text: txtPlace, name: txtName, no: no,must:txtMust}
    form.push(data)
    //console.log(form)
    $("#form_string").val(JSON.stringify(form))

	});
  //手机控件
  $('#AddPhone').click(function(event) {

		/* Act on the event */
		$("#myModal4").modal('hide');  //手动关闭

		var txtPlace = $('.hor-phone-tips').val();
		var txtName = $('.hor-phone-name').val();
		var txtValue = $('.hor-phone-value').val();
    var txtInform=$('.hor-phone-inform').val();

		var strTxt = '<div class="hor-group clearfix">'
				+'<div class="text">'+txtName+'：</div>'
				+'<div class="bd">'
        +'<div class="label-item">'
					+'<input type="text" placeholder="请输入'+txtPlace+'" name="'+txtName+'" value="'+txtValue+'" id="'+txtName+'" class="hor-input" />'
          +'</div>'

					strTxt+='<span class="btn-del hor-del-phone" data-index="'+fn+'"><i class="iconfont icon-delete"></i> 删除</span>'
				strTxt+='</div>'
			strTxt+='</div>';
      strTxt+='<div class="hor-group clearfix" style="display:none;">'
        strTxt+='<div class="text">短信通知内容：</div>'
        strTxt+='<div class="bd">'
          strTxt+='<div class="label-item">'
          strTxt+='<textarea rows="4" style="width:324px;border-radius:4px;border-width:1px;border-color:#999999;border-style:solid;" class="hor-phone-inform" id="inform">'+txtInform+'</textarea>'
          strTxt+='</div>'
        strTxt+='</div>'
      strTxt+='</div>'
		$('#fromSection').append(strTxt)
    var form_string=$("#form_string").val()
    var form=JSON.parse(form_string)
    console.log(form,form.length)
    fn=form.length+1
    //console.log(form)
    var data={type: 4, remind_text: txtPlace, name: txtName, value: txtValue,inform:txtInform}
    form.push(data)
    //console.log(form)
    $("#form_string").val(JSON.stringify(form))

	});

	// 删除
	$(document).on('click', '.hor-del', function(event) {
		event.preventDefault();
		$(this).parents('.hor-group').remove();
    var form_string=$("#form_string").val()
    var form=JSON.parse(form_string)
    var index=event.currentTarget.dataset.index
    form.splice(index,1)
    console.log(index)
    $('.hor-del').each(function(index){
      $(this).attr('data-index',index)
    })

    // for(i in form){
    //   if(i==index){
    //     form[i].del=1
    //   }
    // }
    console.log(form)
    $("#form_string").val(JSON.stringify(form))
	});
  $(document).on('click', '.hor-del-phone', function(event) {
		event.preventDefault();
    $(this).parents('.hor-group').next().remove();
		$(this).parents('.hor-group').remove();
    var form_string=$("#form_string").val()
    var form=JSON.parse(form_string)
    var index=event.currentTarget.dataset.index
    console.log(index)
    form.splice(index,1)
    $('.hor-del-phone').each(function(index){
      $(this).attr('data-index',index)
    })
    // for(i in form){
    //   if(i==index){
    //     form[i].del=1
    //   }
    // }
    console.log(form)
    $("#form_string").val(JSON.stringify(form))
	});
	//添加信息
	$('#addInfo').click(function(event) {
		var str2 = '<div class="info-group">'
					+'<input type="text" value="" placeholder="remind_text" class="hor-input hor-md-input" />'
					+' <input type="text" value="" placeholder="子节点name" class="hor-input" /> <span class="btn-del hor-in-del"><i class="iconfont icon-delete"></i> 删除</span>'
				+'</div>';
		$('#infoSet').append(str2)
	});
  $(document).on('click', '.addInfo', function(event) {
    var api_type=$("#api_type").val()
    var info_string
    if(api_type==4){
      info_string=$("#info_string").val()
    }else{
      info_string=$("#info_string1").val()
    }
    var info=JSON.parse(info_string)
    console.log(info.default_form,info.default_form.length)
    ff=info.default_form.length
    var data={name: "name", api_name: "api默认参数name", remind_text: "提示名称", default_param: 0, show: 1}
    info.default_form.push(data)
    if(api_type==4){
      $("#info_string").val(JSON.stringify(info))
    }else{
      $("#info_string1").val(JSON.stringify(info))
    }
    var str='<div class="list-form" style="padding:10px;">'
      +'<div class="hor-group clearfix">'
        +'<div class="bd">'

          +'<input type="hidden" class="hor-input" placeholder="api默认参数name" name="" value="">'
          +'<input type="text" class="hor-input" placeholder="提示名称" value="">'
          +' <input type="text" placeholder="子节点name" value="" class="hor-input" name=""/>'
          +'<span class="btn-del info-del" data-index="'+ff+'"><i class="iconfont icon-delete"></i> 删除</span>'
        +'</div>'
      +'</div>'
    +'</div>'
    $('.default_form').append(str)
  })
	// 删除
	$(document).on('click', '.hor-in-del', function(event) {
		event.preventDefault();
		$(this).parents('.info-group').remove();
	});


	// 搜索框模板-搜索API调试
	$(document).on('click', '.weui-switch-menu', function(event) {
		if($(this).find('.weui-switch-cp__input').is(':checked')) {
		    $(this).parents('.hor-group').find('.label-toggle').show()
		}else{
			$(this).parents('.hor-group').find('.label-toggle').hide();
		}
	});
  $(document).on('click', '.weui-switch-menu1', function(event) {
		if($(this).find('.weui-switch-cp__input').is(':checked')) {
		    $(this).parents('.label-item').find('.hor-input').show()
		}else{
			$(this).parents('.label-item').find('.hor-input').hide();
		}
	});
  //api_config
  $(document).on('click', '.weui-switch-menu-input', function(event) {
    var index=$(this).data('index')
    var form_string=$("#form_string").val()
    var form=JSON.parse(form_string)
    console.log(index)
    if($(this).find('.weui-switch-cp__input').is(':checked')) {
      form[index].must=1;
    }else{
      form[index].must=0;
    }
    console.log(form)
    $("#form_string").val(JSON.stringify(form))
	});
  $(function(){
    $('.weui-switch-menu').each(function(index,val){
      if($(this).find('.weui-switch-cp__input').is(':checked')) {
  		    $(this).parents('.hor-group').find('.label-toggle').show()
  		}else{
  			$(this).parents('.hor-group').find('.label-toggle').hide();
  		}
    })
    $('.weui-switch-menu1').each(function(index,val){
      if($(this).find('.weui-switch-cp__input').is(':checked')) {
  		    $(this).parents('.label-item').find('.hor-input').show()
  		}else{
  			$(this).parents('.label-item').find('.hor-input').hide();
  		}
    })
  })




	//添加表单
  var api_type=$("#api_type").val()
	var fs = 0
	$('#addForm').click(function(event) {//api_type==1
    var info_string=$("#info_string").val()
    var info=JSON.parse(info_string)
    console.log(info,info.length)
    fs=info.length+1
    var data={name: 'name', remind_text: '提示名称', 'default_param':1,'show':1}
    info.push(data)
    $("#info_string").val(JSON.stringify(info))
		var listcell = '<div class="list-cell">'
							+'<div class="hor-group clearfix">'
              if(api_type==4){
                listcell+='<div class="text">信息报告列表'+fs+'：</div>'
              }else{
								listcell+='<div class="text">列表数据'+fs+'：</div>'
              }
              listcell+='<div class="bd">'
              if(api_type==4){

                listcell+='<input type="hidden" class="hor-input" placeholder="api默认参数name">'
                        +'<input type="text" class="hor-input" placeholder="名称">'
              }
								listcell
									+=' <input type="text" placeholder="子节点name" class="hor-input"/>'

        listcell+='<span class="btn-del list-del"><i class="iconfont icon-delete"></i> 删除</span>'
				        +'</div>'
							+'</div>'
        if(api_type!=4){

						listcell+='<div class="hor-group clearfix">'
								+'<div class="label-item">'
									+'<span class="switch-text">是否做为API默认参数：</span>'
									+'<label for="switchC'+fs+'" class="weui-switch-cp weui-switch-menu1">'
								        +'<input id="switchC'+fs+'" class="weui-switch-cp__input" type="checkbox" checked="checked">'
								       +' <div class="weui-switch-cp__box"></div>'
								    +'</label>'
                    +'<input type="text" placeholder="api默认参数name" class="hor-input" style="margin-left:20px;width:200px;float:left;"/>'
								+'</div>'
								+'<div class="label-item">'
								    +'<span class="switch-text">是否在界面显示：</span>'
									+'<label for="switchP'+fs+'" class="weui-switch-cp weui-switch-menu">'
								        +'<input id="switchP'+fs+'" class="weui-switch-cp__input" type="checkbox" checked="checked">'
								        +'<div class="weui-switch-cp__box"></div>'
								    +'</label>'
								+'</div>'
								+'<div class="label-item label-toggle">'
								    +'<input type="text" class="hor-input hor-xs-input" placeholder="remind_text">'
								   +'<span class="hor-tips">只有在界面显示为YES时显示此文本框</span>'
								+'</div>'
							+'</div>'
            }
						listcell+='</div>';
		$('#listCells').append(listcell)
		//fs =fs+1;
	});
  $(document).on('click', '.addForm', function(event) {//api_type==4,6
      var l=event.currentTarget.dataset.index
      console.log(l)
      var api_type=$("#api_type").val()
      var info_string
      if(api_type==4){
        info_string=$("#info_string").val()
      }else{//6
        info_string=$("#info_string1").val()
      }
      var info=JSON.parse(info_string)
      console.log(info.list,info.list.length)
      var ind=info.list[l].list.length
      var data={name: "name", api_name: "api默认参数name", remind_text: "提示名称", default_param: 0, show: 1}
      info.list[l].list.push(data)
      var index=info.list[l].list.length
      console.log(info.list)
      if(api_type==4){
        $("#info_string").val(JSON.stringify(info))
      }else{//6
        $("#info_string1").val(JSON.stringify(info))
      }

      var listcell='<div class="list-cell" style="padding:10px;" data-index="'+l+'">'
        +'<div class="hor-group clearfix">'
          +'<div class="text">列表数据'+index+'：</div>'
          +'<div class="bd">'
      if(api_type==4){
          listcell+='<input type="hidden" class="hor-input" placeholder="api默认参数name" name="" value="">'
          +'<input type="text" class="hor-input" placeholder="提示名称" value="">'
            +' <input type="text" placeholder="子节点name" value="" class="hor-input" name=""/>'
      }else{
          listcell+='<input type="hidden" class="hor-input" placeholder="api默认参数name" name="" value="" style="width:140px;">'
          +'<input type="text" class="hor-input" placeholder="提示名称" value="" style="width:140px;">'
            +' <input type="text" placeholder="子节点name" value="" class="hor-input" name="" style="width:140px;"/>'
      }
            listcell+='<span class="btn-del list-del list-del'+l+'" data-index="'+ind+'"><i class="iconfont icon-delete"></i> 删除</span>'
          +'</div>'
        +'</div>'
      +'</div>'
      var inn
      $('.listCells').each(function(inde,val){
        inn=$(this).context.dataset.index
        if(inn==l){
          $(this).append(listcell)
        }
      })
  })

  $("#addList").click(function(){
    var api_type=$("#api_type").val()
    var info_string
    if(api_type==4){
      info_string=$("#info_string").val()
    }else{//6
      info_string=$("#info_string1").val()
    }
    var info=JSON.parse(info_string)
    var lnn,ln
    //console.log(info.list,info.list.length)
    if(info_string=='[]'){
      lnn=0
      ln=1
    }else{
      lnn=info.list.length
      ln=info.list.length+1
    }
    var data=new Array()
    data.push({name: "name", api_name: "api默认参数name", remind_text: "提示名称", default_param: 0, show: 1})
    console.log(info_string)
    if(info_string=='[]'){
      var list=new Array()
      var info={}
      list.push({search_position:"data.result",explain:"中文解释",list:data})
      info.list=list
    }else{
      info.list.push({search_position:"data.result",explain:"中文解释",list:data})
    }
    console.log(info)
    if(api_type==4){
      $("#info_string").val(JSON.stringify(info))
      console.log($("#info_string").val())
    }else{//6
      $("#info_string1").val(JSON.stringify(info))
      console.log($("#info_string1").val())
    }

    var listcell = '<div class="hor-group clearfix lists-cell" style="border-width:1px;border-style:solid;padding:10px;border-color:#c0c0c0" data-index="'+lnn+'">'
      +'<div class="text" style="padding:10px;">列表节点位置'+ln+'：</div>'
      +'<div class="bd" style="margin-bottom:10px;">'
      if(api_type==4){
        listcell+='<input type="text" placeholder="showapi_res_body.list" class="hor-input" value=""/>'
        +' <input type="text" class="hor-input" placeholder="中文解释" value=""/>'
      }else{//6
        listcell+='<input type="text" placeholder="showapi_res_body.list" class="hor-input" value="" style="width:140px;"/>'
        +' <input type="text" class="hor-input" placeholder="中文解释" value="" style="width:140px;"/>'
      }
        listcell+='<span class="btn-del lists-del" data-index="'+lnn+'"><i class="iconfont icon-delete"></i> 删除</span>'
      +'</div>'
      +'<div style="font-size:15px;">列表数据：</div>'
      +'<div class="data-list-row" style="border-width:1px;border-style:solid;padding:10px;border-color:#c0c0c0">'
        +'<div class="listCells" data-index="'+lnn+'">'
          +'<div class="list-cell" style="padding:10px;" data-index="'+lnn+'">'
            +'<div class="hor-group clearfix">'
              +'<div class="text">列表数据1：</div>'
              +'<div class="bd">'
          if(api_type==4){
              listcell+='<input type="hidden" class="hor-input" placeholder="api默认参数name" name="api_name" value="">'
              +'<input type="text" class="hor-input" placeholder="提示名称" value="">'
                +' <input type="text" placeholder="子节点name" value="" class="hor-input" name="name"/>'
          }else{//6
            listcell+='<input type="hidden" class="hor-input" placeholder="api默认参数name" name="api_name" value="" style="width:140px;">'
            +'<input type="text" class="hor-input" placeholder="提示名称" value="" style="width:140px;">'
              +' <input type="text" placeholder="子节点name" value="" class="hor-input" name="name" style="width:140px;"/>'
          }
                listcell+='<span class="btn-del list-del list-del'+lnn+'" data-index="0"><i class="iconfont icon-delete"></i> 删除</span>'
              +'</div>'
            +'</div>'
          +'</div>'
        +'</div>'

        +'<div class="lsit-button clearfix">'
          +'<button class="btn btn-add-action addForm" data-index="'+lnn+'">'
            +'<span class="iconfont icon-add"></span> 添加表单'
          +'</button>'
        +'</div>'
      +'</div>'
    +'</div>'

		$('.list-cells').append(listcell)
  })

	// 删除
	$(document).on('click', '.list-del', function(event) {
    var api_type=$("#api_type").val()
    var info_string
		event.preventDefault();
		$(this).parents('.list-cell').remove();
    if(api_type==1){
      info_string=$("#info_string").val()
      var info=JSON.parse(info_string)
      var index=event.currentTarget.dataset.index
      info.splice(index,1)
      $('.list-del').each(function(index){
        $(this).attr('data-index',index)
      })

      $("#info_string").val(JSON.stringify(info))
    }else{
      var l=$(this).parents('.list-cell')[0].dataset.index;
      console.log('l='+l)
      if(api_type==4){
        info_string=$("#info_string").val()
      }else{//6
        info_string=$("#info_string1").val()
      }
      var info=JSON.parse(info_string)
      console.log(info)
      var index=event.currentTarget.dataset.index
      console.log(index)
      info.list[l].list.splice(index,1)

      var index2
      $('.lists-del').each(function(index){
        $('.list-del'+index).each(function(index1){
          $(this).attr('data-index',index1)
          index2=index1*1+1
          $(this).parent().prev()[0].innerText='列表数据'+index2
        })
      })
      console.log(info)
      if(api_type==4){
        $("#info_string").val(JSON.stringify(info))
      }else{
        $("#info_string1").val(JSON.stringify(info))
      }
    }
	});
  // 删除列表
	$(document).on('click', '.lists-del', function(event) {
    var api_type=$("#api_type").val()
    var info_string
		event.preventDefault();
		$(this).parents('.lists-cell').remove();
    if(api_type==4){
      info_string=$("#info_string").val()
    }else{//6
      info_string=$("#info_string1").val()
    }
    console.log(info_string)
    var info=JSON.parse(info_string)
    var index=event.currentTarget.dataset.index
    console.log(index)
    console.log(info)
    info.list.splice(index,1)
    $('.lists-del').each(function(index){
      $(this).attr('data-index',index)
    })
    if(api_type==4){
      $("#info_string").val(JSON.stringify(info))
    }else{
      $("#info_string1").val(JSON.stringify(info))
    }
	});




	$('.temp-btn-row a').click(function(event) {
      $(this).addClass('active').siblings('a').removeClass('active')
  });

  $('#addDefaultForm').click(function(event){
    var api_type=$("#api_type").val()
    var info_string
    if(api_type==4){
      info_string=$("#info_string").val()
    }else{//6
      info_string=$("#info_string1").val()
    }
    console.log(info_string)
    var info=JSON.parse(info_string)

    console.log(info)
    if(typeof(info.default_form)=='undefined'){
      var data={name: "name", api_name: "api默认参数name", remind_text: "提示名称", default_param: 0, show: 1}
      var default_form=new Array()
      default_form.push(data)
      info.default_form=default_form
      console.log(info)
      if(api_type==4){
        $("#info_string").val(JSON.stringify(info))
      }else{//6
        $("#info_string1").val(JSON.stringify(info))
      }
      var str='<div class="hor-group clearfix default-form" style="border-width:1px;border-style:solid;padding:10px;border-color:#c0c0c0">'
      +'<div class="text" style="padding:10px;">默认表单：</div>'
      +'<div class="bd" style="margin-bottom:10px;">'
        +'<span class="btn-del form-del"><i class="iconfont icon-delete"></i> 删除</span>'
      +'</div>'

        +'<div class="default_form">'
          +'<div class="list-form" style="padding:10px;">'
            +'<div class="hor-group clearfix">'
              +'<div class="bd">'

                +'<input type="hidden" class="hor-input" placeholder="api默认参数name" name="" value="">'
                +'<input type="text" class="hor-input" placeholder="提示名称" value="">'
                +' <input type="text" placeholder="子节点name" value="" class="hor-input" name=""/>'
                +'<span class="btn-del info-del" data-index="0"><i class="iconfont icon-delete"></i> 删除</span>'
              +'</div>'
            +'</div>'
          +'</div>'
        +'</div>'

        +'<div class="lsit-button clearfix">'
          +'<button class="btn btn-add-action addInfo">'
            +'<span class="iconfont icon-add"></span> 添加信息项'
          +'</button>'
        +'</div>'
        +'</div>'
        $('.default-form-add').append(str)
    }
  })
  $(document).on('click', '.form-del', function(event) {
    var api_type=$("#api_type").val()
    var info_string
    $('.default-form').remove()
    if(api_type==4){
      info_string=$("#info_string").val()
    }else{//6
      info_string=$("#info_string1").val()
    }
    console.log(info_string)
    var info=JSON.parse(info_string)
    console.log(info)
    delete info.default_form
    console.log(info)
    if(api_type==4){
      $("#info_string").val(JSON.stringify(info))
    }else{//6
      $("#info_string1").val(JSON.stringify(info))
    }
  })
  $(document).on('click', '.info-del', function(event) {
    var api_type=$("#api_type").val()
    var info_string
    $(this).parents('.list-form').remove()
    if(api_type==4){
      info_string=$("#info_string").val()
    }else{//6
      info_string=$("#info_string1").val()
    }
    var info=JSON.parse(info_string)
    var index=event.currentTarget.dataset.index
    info.default_form.splice(index,1)
    $('.info-del').each(function(index){
      $(this).attr('data-index',index)
    })
    if(api_type==4){
      $("#info_string").val(JSON.stringify(info))
    }else{//6
      $("#info_string1").val(JSON.stringify(info))
    }
  })


});
