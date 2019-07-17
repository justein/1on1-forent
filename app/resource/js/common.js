// JavaScript Document
function SwapTab(name,title,content,Sub,cur){
  $(name+' '+title).click(function(){
	  $(this).addClass(cur).siblings().removeClass(cur);
	  $(content+" > "+Sub).eq($(name+' '+title).index(this)).fadeIn().siblings().hide();
  });
}
function SwapTab2(name,title,content,Sub,cur){
  $(name+' '+title).hover(function(){
	  $(this).addClass(cur).siblings().removeClass(cur);
	  $(content+" > "+Sub).eq($(name+' '+title).index(this)).fadeIn('fast').siblings().hide();
  });
}
jQuery.divselect = function(divselectid,inputselectid) {
    var inputselect = $(inputselectid);
    $(divselectid+" cite").click(function(){
        var ul = $(divselectid+" ul");
        if(ul.css("visibility")=="hidden"){
            ul.addClass('show')
        }else{
            ul.removeClass('show')
        }
    });
    $(divselectid+" ul li a").click(function(){
        var txt = $(this).text();
        $(divselectid+" cite").html(txt);
        var value = $(this).attr("selectid");
        inputselect.val(value);
        $(divselectid+" ul").removeClass('show')
        
    });
};
$(function(){
	new SwapTab('.t-tabs','li','.things-cont','.t-pane','active')
	$.divselect("#divselect","#inputselect");
   
    // 下拉导航
    $('.nav-dropdown').hover(function() {
        $(this).toggleClass('show');
        $('.nav-menu-dropdown').slideToggle('fast')
    });
    // 下拉 更多菜单
    $('.menu-item').hover(function() {
        $('.menu-slide-box').hide();
        var cId = $(this).attr('data-target');
        $("#"+cId).show();
    });
    $('.nav-menu-dropdown').hover(function() {
        $(this).toggleClass('nav-slide-show');
    });

    // 信息分类搜索页面   筛选选择
    $('.filter-list li').click(function(event) {
        $(this).addClass('active').siblings('li').removeClass('active')
    });
    $('.orders-lt li').click(function(event) {
        $(this).addClass('active').siblings('li').removeClass('active')
    });

    $('.fSort').click(function(e) {
        if ($(this).find('.f-ico-triangle-mt').hasClass('cur')) {
            $(this).find('.f-ico-triangle-mt').removeClass('cur')
            $(this).find('.f-ico-triangle-mb').addClass('cur')
        } else {
            $('.f-ico-triangle-mt').removeClass('cur')
            $('.f-ico-triangle-mb').removeClass('cur')
            $(this).find('.f-ico-triangle-mt').addClass('cur')
            $(this).find('.f-ico-triangle-mb').removeClass('cur')
        }
    });

    // 详情收藏
    $('.lk-shoucang').click(function(event) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active')
        } else {
            $(this).addClass('active')
        }
    });



    // 扣款确认弹窗
    new SwapTab('.pay-tabs','li','.tab-content','.tab-pane','active')


    $('.p-cont a').click(function(event) {
        $(this).addClass('active').siblings('a').removeClass('active')
    });


   


});
